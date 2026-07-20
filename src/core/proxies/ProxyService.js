/**
 * ProxyService — CRUD + health checking for per-account geo proxies.
 * Used by SessionManager (already injects) and admin flows.
 */
import https from 'https';
import { logger } from '../../utils/logger.js';
import { encrypt, decrypt } from '../../utils/encryption.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

/** Strip secrets for API list responses. */
export function publicProxyRow(row) {
  if (!row) return null;
  const { password_enc, ...rest } = row;
  return {
    ...rest,
    has_password: !!password_enc,
    username: row.username || null,
  };
}

export class ProxyService {
  constructor(db) {
    this.db = db;
  }

  async listProxies(filters = {}) {
    let q = this.db('proxies').select('*').orderBy('created_at', 'desc');
    if (filters.status) q = q.where({ status: filters.status });
    if (filters.region) q = q.where({ region: filters.region });
    const rows = await q;
    return rows.map(publicProxyRow);
  }

  async getProxy(id) {
    return this.db('proxies').where({ id }).first();
  }

  async getProxyPublic(id) {
    return publicProxyRow(await this.getProxy(id));
  }

  async createProxy(data) {
    const { password, ...rest } = data;
    const password_enc = password ? encrypt(password) : null;
    const [row] = await this.db('proxies')
      .insert({
        ...rest,
        password_enc,
        status: rest.status || 'active',
      })
      .returning('*');
    return row;
  }

  async updateProxy(id, data) {
    const update = { ...data };
    if (data.password) {
      update.password_enc = encrypt(data.password);
      delete update.password;
    }
    const [row] = await this.db('proxies').where({ id }).update(update).returning('*');
    return row;
  }

  async deleteProxy(id) {
    await this.db('proxies').where({ id }).del();
  }

  /**
   * Build a Node agent for this proxy (same URL style as SessionManager).
   * SOCKS uses socks5h so DNS resolves remotely.
   * @param {{ socksMode?: 'socks5h' | 'socks5' }} [opts]
   */
  buildAgent(proxyRow, opts = {}) {
    const { type, host, port, username, password_enc } = proxyRow;
    let password;
    if (password_enc) {
      try { password = decrypt(password_enc); } catch { /* ignore */ }
    }
    // Do NOT over-encode auth: many SOCKS providers reject percent-encoded credentials.
    // Only encode characters that break URL parsing (@ : / #).
    const enc = (s) => String(s ?? '').replace(/([@:/#\\%])/g, encodeURIComponent);
    const auth = username ? `${enc(username)}:${enc(password || '')}@` : '';
    const socksMode = opts.socksMode || 'socks5h';
    const proxyUrl = type === 'socks5'
      ? `${socksMode}://${auth}${host}:${port}`
      : `${type || 'http'}://${auth}${host}:${port}`;

    if (type === 'socks5') return new SocksProxyAgent(proxyUrl);
    return new HttpsProxyAgent(proxyUrl);
  }

  /**
   * HTTPS GET through agent. Residential pools often block specific IP-check hosts
   * (e.g. api.ipify.org) while Google/Cloudflare still work — so callers try several URLs.
   */
  _httpsGetThroughAgent(agent, url, timeoutMs = 12000) {
    return new Promise((resolve) => {
      const start = Date.now();
      const req = https.get(
        url,
        {
          agent,
          timeout: timeoutMs,
          headers: {
            Accept: '*/*',
            'User-Agent': 'wa-control-proxy-test/1.0',
            Connection: 'close',
          },
        },
        (res) => {
          let body = '';
          res.on('data', (c) => { body += c; if (body.length > 8192) body = body.slice(0, 8192); });
          res.on('end', () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 400,
              status: res.statusCode,
              latencyMs: Date.now() - start,
              body,
              error: null,
            });
          });
        }
      );
      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, status: 0, latencyMs: Date.now() - start, body: '', error: `timeout after ${timeoutMs}ms` });
      });
      req.on('error', (e) => {
        resolve({ ok: false, status: 0, latencyMs: Date.now() - start, body: '', error: e.message });
      });
    });
  }

  /** Pull an IP from common check endpoints / Cloudflare trace. */
  _extractExitIp(body, contentHint = '') {
    if (!body) return null;
    const text = String(body).trim();
    // plain IP (v4 or v6)
    if (/^[\d.]+$/.test(text) || /^[0-9a-f:]+$/i.test(text)) return text.split('\n')[0].trim();
    try {
      const j = JSON.parse(text);
      if (j.ip) return String(j.ip);
      if (j.origin) return String(j.origin).split(',')[0].trim();
    } catch { /* not JSON */ }
    // cloudflare /cdn-cgi/trace
    const m = text.match(/(?:^|\n)ip=([^\s\n]+)/);
    if (m) return m[1].trim();
    // any IPv4 in body
    const v4 = text.match(/\b(\d{1,3}(?:\.\d{1,3}){3})\b/);
    if (v4) return v4[1];
    return contentHint || null;
  }

  /**
   * Test a proxy the same way operators verify with curl --socks5 (HTTPS through tunnel).
   *
   * IMPORTANT: Many residential proxies block api.ipify.org / AWS checkip while allowing
   * Google/Cloudflare. We therefore probe multiple targets and only mark fail if ALL fail.
   *
   * Returns { ok, latencyMs, ip?, status?, error?, probe?, attempts? }
   */
  async testProxy(proxyRow) {
    const start = Date.now();
    let agent;
    try {
      agent = this.buildAgent(proxyRow);
    } catch (e) {
      return { ok: false, latencyMs: 0, error: e.message };
    }

    // Order: connectivity first (matches curl -I google), then IP check hosts.
    // Avoid relying solely on api.ipify.org — widely blocked by resi pools.
    const probes = [
      { url: 'https://www.google.com/generate_204', name: 'google_204', wantIp: false },
      { url: 'https://www.cloudflare.com/cdn-cgi/trace', name: 'cloudflare_trace', wantIp: true },
      { url: 'https://icanhazip.com/', name: 'icanhazip', wantIp: true },
      { url: 'https://ifconfig.me/ip', name: 'ifconfig_me', wantIp: true },
      { url: 'https://api.ipify.org?format=json', name: 'ipify', wantIp: true },
    ];

    const attempts = [];
    let connectivityOk = null;
    let ip = null;
    let bestLatency = null;

    for (const probe of probes) {
      // Fresh agent per request — some SOCKS libs reuse broken sockets after Failure
      try { agent = this.buildAgent(proxyRow); } catch (e) {
        attempts.push({ probe: probe.name, ok: false, error: e.message });
        continue;
      }
      const res = await this._httpsGetThroughAgent(agent, probe.url, 15000);
      attempts.push({
        probe: probe.name,
        ok: res.ok,
        status: res.status,
        latencyMs: res.latencyMs,
        error: res.error || undefined,
      });

      if (!res.ok) continue;

      if (connectivityOk == null) {
        connectivityOk = {
          probe: probe.name,
          status: res.status,
          latencyMs: res.latencyMs,
        };
        bestLatency = res.latencyMs;
      }

      if (probe.wantIp && !ip) {
        const found = this._extractExitIp(res.body);
        if (found) {
          ip = found;
          // Prefer first successful IP probe latency for reporting
          bestLatency = res.latencyMs;
          break;
        }
      }

      // If google_204 worked and we only needed connectivity, keep going for IP
      // but don't fail the whole test if later IP hosts are blocked.
    }

    const latencyMs = Date.now() - start;

    if (connectivityOk) {
      const ipAttempt = attempts.find((a) => a.ok && a.probe !== 'google_204');
      return {
        ok: true,
        latencyMs: bestLatency ?? connectivityOk.latencyMs,
        totalMs: latencyMs,
        ip: ip || 'unknown',
        status: connectivityOk.status,
        // Prefer the IP probe name when we got an exit IP; else connectivity probe
        probe: ip && ipAttempt ? ipAttempt.probe : connectivityOk.probe,
        attempts,
        note: ip
          ? undefined
          : 'Proxy works (HTTPS OK) but exit IP check hosts were blocked by the pool — same as curl to google succeeding while ipify fails.',
      };
    }

    const last = attempts[attempts.length - 1];
    return {
      ok: false,
      latencyMs,
      error: last?.error || 'all probe targets failed through proxy',
      attempts,
      hint:
        'If curl --socks5 user:pass@host:port -I https://www.google.com works, check credentials in DB and that type=socks5. ' +
        'Do not rely on api.ipify.org alone — many resi pools block it.',
    };
  }

  /**
   * Run health check on all or one proxy, update status/success_rate in DB.
   */
  async checkHealth(proxyId = null) {
    const proxies = proxyId
      ? [await this.getProxy(proxyId)].filter(Boolean)
      : await this.db('proxies').select('*');

    const results = [];
    for (const p of proxies) {
      const test = await this.testProxy(p);
      const successRate = test.ok
        ? Math.min(1.0, (p.success_rate || 0.9) * 0.7 + 0.3)
        : Math.max(0.1, (p.success_rate || 0.8) * 0.6);

      const newStatus = test.ok ? 'active' : (p.status === 'active' ? 'degraded' : 'dead');

      await this.db('proxies')
        .where({ id: p.id })
        .update({
          status: newStatus,
          success_rate: parseFloat(successRate.toFixed(2)),
          last_checked_at: this.db.fn.now(),
        });

      results.push({ id: p.id, ...test, newStatus });
      logger.info('Proxy health checked', { proxy: p.name || p.id, ok: test.ok, latency: test.latencyMs });
    }
    return results;
  }
}

export default ProxyService;
