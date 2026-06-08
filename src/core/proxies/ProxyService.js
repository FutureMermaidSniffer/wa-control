/**
 * ProxyService — CRUD + health checking for per-account geo proxies.
 * Used by SessionManager (already injects) and admin flows.
 */
import { logger } from '../../utils/logger.js';
import { encrypt, decrypt } from '../../utils/encryption.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';

export class ProxyService {
  constructor(db) {
    this.db = db;
  }

  async listProxies(filters = {}) {
    let q = this.db('proxies').select('*').orderBy('created_at', 'desc');
    if (filters.status) q = q.where({ status: filters.status });
    if (filters.region) q = q.where({ region: filters.region });
    return q;
  }

  async getProxy(id) {
    return this.db('proxies').where({ id }).first();
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
   * Test a proxy by making a fetch through it.
   * Returns { ok, latencyMs, status, error? }
   */
  async testProxy(proxyRow) {
    const start = Date.now();
    const { type, host, port, username, password_enc } = proxyRow;
    const password = password_enc ? decrypt(password_enc) : undefined;
    const auth = username ? `${username}:${password || ''}@` : '';
    const proxyUrl = `${type}://${auth}${host}:${port}`;

    let agent;
    try {
      if (type === 'socks5') {
        agent = new SocksProxyAgent(proxyUrl);
      } else {
        agent = new HttpsProxyAgent(proxyUrl);
      }
    } catch (e) {
      return { ok: false, latencyMs: 0, error: e.message };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      // Use a simple public endpoint or ip check that works via proxy
      const res = await fetch('https://api.ipify.org?format=json', {
        agent,
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const latency = Date.now() - start;
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: true, latencyMs: latency, ip: data.ip || 'unknown' };
      }
      return { ok: false, latencyMs: latency, status: res.status };
    } catch (e) {
      clearTimeout(timeout);
      return { ok: false, latencyMs: Date.now() - start, error: e.message };
    }
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
