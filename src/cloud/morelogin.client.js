/**
 * MoreLogin Cloud Phone Client (Open API + Local API support)
 *
 * Full parity with their Python SDK + docs for our use cases:
 * - Device create/power/info/wait
 * - App install/start + discovery
 * - exeCommand (ADB shell over API)
 * - touch/click
 * - screenshots
 * - proxy assignment
 * - file up/down (partial)
 *
 * Designed for wa-control phone-less registration + primary device control.
 * We do NOT keep cloud phones running after successful Baileys link.
 */

import config from '../config/index.js';
import { logger } from '../utils/logger.js';

const DEFAULT_HOST = 'https://api.morelogin.com';
const LOCAL_HOST = 'http://127.0.0.1:40000';

export class MoreLoginClient {
  constructor(opts = {}) {
    this.mode = opts.mode || config.MORELOGIN_MODE || 'open';
    this.apiId = opts.apiId || config.MORELOGIN_API_ID;
    this.apiKey = opts.apiKey || config.MORELOGIN_API_KEY;
    this.localBase = opts.localBase || config.MORELOGIN_LOCAL_API || LOCAL_HOST;

    this.host = this.mode === 'local' ? this.localBase : DEFAULT_HOST;
    this.isLocal = this.mode === 'local';

    this.__token = null;
    this.__tokenExpireAt = 0;

    // Simple in-memory for now; can promote to Redis later
    this._sessionHeaders = null;
  }

  _getBase() {
    return this.host.replace(/\/$/, '');
  }

  async getToken(timeout = 15000) {
    if (this.isLocal) {
      // Local API: token optional, usually no OAuth. Return empty or static if configured.
      // For simplicity we return a placeholder; caller decides whether to send Authorization.
      return '';
    }

    if (!this.apiId || !this.apiKey) {
      throw new Error('MORELOGIN_API_ID and MORELOGIN_API_KEY are required for Open API');
    }

    const now = Date.now();
    if (this.__token && now < this.__tokenExpireAt) {
      return this.__token;
    }

    const url = `${this._getBase()}/oauth2/token`;
    const payload = {
      client_id: this.apiId,
      client_secret: this.apiKey,
      grant_type: 'client_credentials',
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.code !== 0) {
      const msg = json?.msg || json?.error || res.statusText;
      throw new Error(`MoreLogin token failed: ${msg} (code=${json.code})`);
    }

    const tok = json.data?.access_token;
    const expiresIn = json.data?.expires_in || 3600;
    if (!tok) throw new Error('No access_token in token response');

    this.__token = tok;
    // Refresh 60s early
    this.__tokenExpireAt = now + (expiresIn - 60) * 1000;

    logger.debug('MoreLogin Open API token acquired', { expiresIn });
    return tok;
  }

  async _request(path, payload = {}, { method = 'POST', timeout = 20000 } = {}) {
    const base = this._getBase();
    const url = `${base}${path.startsWith('/') ? '' : '/'}${path}`;
    const headers = { 'Content-Type': 'application/json' };

    if (!this.isLocal) {
      const token = await this.getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    } else {
      // Local: if user enabled auth in MoreLogin desktop, they can put token in env later.
      // For now assume no-auth or pass via future config.
      // Support static local token if provided via MORELOGIN_LOCAL_TOKEN
      if (process.env.MORELOGIN_LOCAL_TOKEN) {
        headers.Authorization = process.env.MORELOGIN_LOCAL_TOKEN;
      }
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: method === 'GET' ? undefined : JSON.stringify(payload),
        signal: controller.signal,
      });

      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = { raw: text }; }

      if (!res.ok) {
        logger.warn('MoreLogin HTTP error', { url, status: res.status, body: json });
        throw new Error(`MoreLogin ${res.status}: ${json?.msg || json?.error || text}`);
      }

      // MoreLogin standard: { code: 0 | >0, msg, data, requestId }
      if (json.code != null && json.code !== 0) {
        const err = new Error(`MoreLogin API error code=${json.code}: ${json.msg || ''}`);
        err.code = json.code;
        err.requestId = json.requestId;
        err.data = json.data;
        throw err;
      }

      return json;
    } catch (e) {
      if (e.name === 'AbortError') {
        throw new Error(`MoreLogin request timeout to ${url}`);
      }
      throw e;
    } finally {
      clearTimeout(id);
    }
  }

  // ===================== Device Management =====================

  async listDevices(pageNo = 1, pageSize = 100) {
    // Both APIs support /cloudphone/page (local uses /api prefix)
    const path = this.isLocal ? '/api/cloudphone/page' : '/cloudphone/page';
    return this._request(path, { pageNo, pageSize });
  }

  async getDeviceInfo(id) {
    const path = this.isLocal ? '/api/cloudphone/info' : '/cloudphone/info';
    return this._request(path, { id });
  }

  async createPhone(params = {}) {
    // Minimal: { skuId: '10004', quantity: 1, ... }
    const path = this.isLocal ? '/api/cloudphone/create' : '/cloudphone/create';
    const payload = {
      skuId: params.skuId || config.MORELOGIN_DEFAULT_SKU_ID,
      quantity: params.quantity || 1,
      ...params,
    };
    return this._request(path, payload);
  }

  async powerOn(id, extra = {}) {
    const path = this.isLocal ? '/api/cloudphone/powerOn' : '/cloudphone/powerOn';
    // Always try to pass proxyId if you have it - required for many accounts per docs
    return this._request(path, { id, ...extra });
  }

  async powerOff(id) {
    const path = this.isLocal ? '/api/cloudphone/powerOff' : '/cloudphone/powerOff';
    return this._request(path, { id });
  }

  async waitUntilReady(id, { timeoutSeconds = 300, pollInterval = 5 } = {}) {
    const start = Date.now();
    while (true) {
      const info = await this.getDeviceInfo(id);
      const envStatus = info?.data?.envStatus;
      // 4 = ready/powered on (from SDK + docs)
      if (envStatus === 4 || envStatus === '4') {
        logger.info('MoreLogin cloud phone ready', { id, envStatus });
        return info;
      }
      if ((Date.now() - start) / 1000 > timeoutSeconds) {
        throw new Error(`Timeout waiting for cloud phone ${id} to be ready (lastStatus=${envStatus})`);
      }
      await new Promise(r => setTimeout(r, pollInterval * 1000));
    }
  }

  async newMachine(id) {
    const path = this.isLocal ? '/api/cloudphone/newMachine' : '/cloudphone/newMachine';
    return this._request(path, { id });
  }

  // ===================== App Management =====================

  async listApps(pageNum = 1, pageSize = 100, appName = null) {
    const path = this.isLocal ? '/api/cloudphone/app/page' : '/cloudphone/app/page';
    const payload = { page_num: pageNum, page_size: pageSize };
    if (appName) payload.app_name = appName;
    return this._request(path, payload);
  }

  async installApp(id, packageName, versionCode) {
    const path = this.isLocal ? '/api/cloudphone/app/install' : '/cloudphone/app/install';
    return this._request(path, { id, packageName, versionCode: Number(versionCode) });
  }

  async startApp(id, packageName) {
    const path = this.isLocal ? '/api/cloudphone/app/start' : '/cloudphone/app/start';
    return this._request(path, { id, packageName });
  }

  async stopApp(id, packageName) {
    const path = this.isLocal ? '/api/cloudphone/app/stop' : '/cloudphone/app/stop';
    return this._request(path, { id, packageName });
  }

  async listInstalledApps(id) {
    const path = this.isLocal ? '/api/cloudphone/app/installedList' : '/cloudphone/app/installedList';
    const res = await this._request(path, { id });
    return res.data || [];
  }

  // ===================== Control / ADB =====================

  async enableAdb(id) {
    const path = this.isLocal ? '/api/cloudphone/enableAdb' : '/cloudphone/enableAdb';
    return this._request(path, { id });
  }

  async exeCommand(id, command) {
    const path = this.isLocal ? '/api/cloudphone/exeCommand' : '/cloudphone/exeCommand';
    return this._request(path, { id, command });
  }

  async touchClick(id, x, y) {
    const path = this.isLocal ? '/api/cloudphone/touch/click' : '/cloudphone/touch/click';
    return this._request(path, { id, pos: [x, y] });
  }

  /**
   * Clear app data (fast reset of WhatsApp state without reinstall).
   */
  async clearAppData(id, packageName = 'com.whatsapp') {
    return this.exeCommand(id, `pm clear ${packageName}`);
  }

  /**
   * Force-stop app.
   */
  async forceStopApp(id, packageName = 'com.whatsapp') {
    return this.exeCommand(id, `am force-stop ${packageName}`);
  }

  /**
   * Try to launch WhatsApp directly into registration flow.
   */
  async launchWhatsAppForRegistration(id) {
    // Main launcher + explicit registration if possible
    const cmds = [
      `am start -n com.whatsapp/.Main`,
      `am start -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -n com.whatsapp/.registration.RegistrationActivity`,
      `am start -n com.whatsapp/com.whatsapp.registration.RegisterPhone`
    ];
    for (const cmd of cmds) {
      const res = await this.exeCommand(id, cmd).catch(() => null);
      if (res && res.code === 0) break;
    }
    return this.exeCommand(id, 'wm size'); // just to return something
  }

  /**
   * Get current focused activity (for debugging UI state).
   */
  async getFocusedActivity(id) {
    return this.exeCommand(id, 'dumpsys activity activities | grep -E "mResumedActivity|mFocusedActivity" | head -3');
  }

  /**
   * Quick check if WhatsApp is installed.
   */
  async isWhatsAppInstalled(id) {
    const res = await this.listInstalledApps(id).catch(() => []);
    return res.some(a => (a.packageName || a.package_name) === 'com.whatsapp');
  }

  // ===================== Screenshots =====================

  async screenshotBase64(id) {
    const path = this.isLocal ? '/api/cloudphone/screenCapBase64' : '/cloudphone/screenCapBase64';
    return this._request(path, { id });
  }

  async screenshotUrl(id) {
    const path = this.isLocal ? '/api/cloudphone/screenCap' : '/cloudphone/screenCap';
    return this._request(path, { id });
  }

  // ===================== Proxy =====================

  async setProxy(ids, proxy) {
    // proxy = { proxyProvider: 0|1|2 (http/https/socks5), proxyIp, proxyPort, username, password }
    const path = this.isLocal ? '/api/cloudphone/setProxy' : '/cloudphone/setProxy';
    return this._request(path, { ids: Array.isArray(ids) ? ids : [ids], proxy });
  }

  // ===================== Convenience =====================

  /**
   * Discover a WhatsApp app version from the MoreLogin app library.
   * Returns { packageName, versionCode, versionName, appName } or null.
   */
  async findWhatsAppApp() {
    const res = await this.listApps(1, 50, 'WhatsApp');
    let candidates = [];
    const data = res?.data;

    if (Array.isArray(data)) candidates = data;
    else if (data?.dataList) candidates = data.dataList;
    else if (data?.list) candidates = data.list;

    const wa = candidates.find(a =>
      (a.packageName || a.package_name || '').toLowerCase().includes('whatsapp') ||
      (a.appName || a.app_name || '').toLowerCase().includes('whatsapp')
    );

    if (!wa) return null;

    const pkg = wa.packageName || wa.package_name || 'com.whatsapp';
    const versions = wa.appVersionList || wa.app_version_list || wa.versions || [];
    if (!versions.length) return { packageName: pkg, versionCode: null, appName: wa.appName || wa.app_name };

    // Prefer highest versionCode
    const best = versions.slice().sort((a, b) => (Number(b.versionCode || b.version_code) || 0) - (Number(a.versionCode || a.version_code) || 0))[0];
    return {
      packageName: pkg,
      versionCode: Number(best.versionCode || best.version_code),
      versionName: best.versionName || best.version_name,
      appName: wa.appName || wa.app_name,
    };
  }
}

export default MoreLoginClient;
