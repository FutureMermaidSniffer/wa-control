import ProxyService from '../../core/proxies/ProxyService.js';
import db from '../../db/connection.js';
import { parseProxyText } from '../../utils/proxy-parser.js';
import { logger } from '../../utils/logger.js';

let proxyService;

function getProxyService() {
  if (!proxyService) proxyService = new ProxyService(db);
  return proxyService;
}

export async function listProxies(req, res, next) {
  try {
    const { status, region } = req.query;
    const svc = getProxyService();
    const proxies = await svc.listProxies({ status, region });
    res.json({ data: proxies });
  } catch (e) { next(e); }
}

export async function createProxy(req, res, next) {
  try {
    const svc = getProxyService();
    const proxy = await svc.createProxy(req.body);
    res.status(201).json({ data: proxy });
  } catch (e) { next(e); }
}

export async function getProxy(req, res, next) {
  try {
    const svc = getProxyService();
    const proxy = await svc.getProxy(req.params.id);
    if (!proxy) return res.status(404).json({ error: 'Proxy not found' });
    res.json({ data: proxy });
  } catch (e) { next(e); }
}

export async function updateProxy(req, res, next) {
  try {
    const svc = getProxyService();
    const proxy = await svc.updateProxy(req.params.id, req.body);
    res.json({ data: proxy });
  } catch (e) { next(e); }
}

export async function deleteProxy(req, res, next) {
  try {
    const svc = getProxyService();
    await svc.deleteProxy(req.params.id);
    res.json({ success: true });
  } catch (e) { next(e); }
}

export async function testProxy(req, res, next) {
  try {
    const svc = getProxyService();
    const proxy = await svc.getProxy(req.params.id);
    if (!proxy) return res.status(404).json({ error: 'Proxy not found' });
    const result = await svc.testProxy(proxy);
    res.json({ data: result });
  } catch (e) { next(e); }
}

export async function runHealthCheck(req, res, next) {
  try {
    const svc = getProxyService();
    const results = await svc.checkHealth(req.query.proxyId || null);
    res.json({ data: results });
  } catch (e) { next(e); }
}

export async function importProxies(req, res, next) {
  try {
    const { text, defaultType = 'socks5', namePrefix = '', region } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text (proxy list content) is required' });
    }

    const svc = getProxyService();
    const candidates = parseProxyText(text, { defaultType, namePrefix, region });

    const results = { imported: 0, skipped: 0, errors: [], created: [], skippedIds: [] };

    // Dedup on host+port (we keep type in DB but port usually differs for http vs socks on same provider).
    // When skipping we still return the ID of the existing proxy.
    const existing = await db('proxies').select('id', 'host', 'port', 'type');
    const existingKeys = new Set();
    const hostPortToId = new Map();
    existing.forEach(e => {
      const key = `${e.host}:${e.port}`;
      existingKeys.add(key);
      if (!hostPortToId.has(key)) hostPortToId.set(key, e.id);
    });

    for (const c of candidates) {
      const key = `${c.host}:${c.port}`;
      if (existingKeys.has(key)) {
        results.skipped++;
        const existingId = hostPortToId.get(key);
        if (!results.skippedIds) results.skippedIds = [];
        if (existingId && !results.skippedIds.includes(existingId)) results.skippedIds.push(existingId);
        continue;
      }

      try {
        const created = await svc.createProxy(c);
        results.imported++;
        results.created.push({ id: created.id, name: created.name, host: created.host, port: created.port, type: c.type || defaultType });
        existingKeys.add(key);
        hostPortToId.set(key, created.id);
      } catch (err) {
        results.errors.push({ item: c, error: err.message });
      }
    }

    if (results.created.length > 0) {
      logger.info(`[PROXY-IMPORT] Successfully created ${results.imported} proxy(ies): ${results.created.map(p => p.id).join(', ')}`, { created: results.created });
      console.log('[PROXY-IMPORT] New proxy IDs (copy these):', results.created.map(p => p.id));
      console.log('Example connect body with one of them:');
      console.log(JSON.stringify({ phone: "+19402245391", usePairingCode: true, proxyId: results.created[0].id }, null, 2));
    }
    if (results.skippedIds.length > 0) {
      console.log('[PROXY-IMPORT] Skipped (already existed), use these IDs:', results.skippedIds);
      console.log('Example connect body with existing one:');
      console.log(JSON.stringify({ phone: "+19402245391", usePairingCode: true, proxyId: results.skippedIds[0] }, null, 2));
    }
    console.log('To list all (and see IDs): curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/v1/proxies');
    if (results.errors.length > 0) {
      logger.warn('Some proxies failed to import', { errors: results.errors });
    }

    res.status(201).json({
      data: results,
      message: `Imported ${results.imported}, skipped ${results.skipped} duplicates, ${results.errors.length} errors.`
    });
  } catch (e) { next(e); }
}

/**
 * Quick-add a single proxy from a URL string.
 * Accepts: { url: "http://user:pass@host:port" } or { url: "socks5://host:port" }
 * or a split form: { host, port, type?, username?, password? }
 *
 * Returns the created (or existing) proxy ID immediately.
 *
 * Example for the user's proxy:
 *   POST /api/v1/proxies/quick-add
 *   { "url": "http://148.113.193.96:5959" }
 */
export async function quickAddProxy(req, res, next) {
  try {
    const svc = getProxyService();
    let proxyData;

    if (req.body.url) {
      const parsed = parseProxyText(req.body.url, { defaultType: req.body.type || 'http' });
      if (!parsed.length) {
        return res.status(400).json({ error: 'Could not parse proxy URL. Use format: http://user:pass@host:port or http://host:port' });
      }
      proxyData = parsed[0];
    } else if (req.body.host && req.body.port) {
      proxyData = {
        host: req.body.host,
        port: parseInt(req.body.port, 10),
        type: req.body.type || 'http',
        username: req.body.username || req.body.user,
        password: req.body.password || req.body.pass,
        region: req.body.region,
      };
    } else {
      return res.status(400).json({ error: 'Provide either { url } or { host, port, type? }' });
    }

    // Check for existing
    const existing = await db('proxies')
      .where({ host: proxyData.host, port: proxyData.port })
      .first();
    if (existing) {
      return res.json({
        data: existing,
        created: false,
        message: `Proxy ${proxyData.host}:${proxyData.port} already exists (id=${existing.id})`,
        next: `Use proxyId: "${existing.id}" when calling /sessions/connect`,
      });
    }

    if (req.body.name) proxyData.name = req.body.name;
    if (req.body.region) proxyData.region = req.body.region;
    proxyData.type = proxyData.type || 'http';

    const proxy = await svc.createProxy(proxyData);
    logger.info(`Quick-added proxy ${proxy.type}://${proxy.host}:${proxy.port} id=${proxy.id}`);

    res.status(201).json({
      data: proxy,
      created: true,
      message: `Proxy added: ${proxy.type}://${proxy.host}:${proxy.port}`,
      next: `Use proxyId: "${proxy.id}" in POST /api/v1/sessions/connect body to route Baileys through this proxy`,
    });
  } catch (e) { next(e); }
}

/**
 * Bulk-assign a proxy to multiple accounts (or all accounts without one).
 * Body: { proxyId: "<uuid>", accountIds?: ["uuid", ...], overwrite?: false }
 * If accountIds is omitted, assigns to all accounts that have no proxy_id.
 */
export async function bulkAssignProxy(req, res, next) {
  try {
    // Support both 'overwrite' and its inverse alias 'onlyUnassigned' from the UI
    const { proxyId, accountIds } = req.body;
    const overwrite = req.body.overwrite === true || req.body.onlyUnassigned === false || (!req.body.hasOwnProperty('onlyUnassigned') && !req.body.hasOwnProperty('overwrite') ? false : undefined);
    const effectiveOverwrite = req.body.overwrite === true || req.body.onlyUnassigned === false;
    if (!proxyId) return res.status(400).json({ error: 'proxyId required' });

    const proxy = await db('proxies').where({ id: proxyId }).first();
    if (!proxy) return res.status(404).json({ error: 'Proxy not found' });

    let query = db('ws_accounts');
    if (accountIds && accountIds.length) {
      query = query.whereIn('id', accountIds);
      if (!effectiveOverwrite) query = query.whereNull('proxy_id');
    } else if (!effectiveOverwrite) {
      // Only unassigned accounts
      query = query.whereNull('proxy_id');
    }
    // If effectiveOverwrite and no accountIds → all accounts

    const affected = await query.update({ proxy_id: proxyId, updated_at: db.fn.now() });

    logger.info(`Bulk-assigned proxy ${proxyId} to ${affected} accounts`);
    res.json({
      success: true,
      proxyId,
      proxy: `${proxy.type}://${proxy.host}:${proxy.port}`,
      accountsUpdated: affected,
    });
  } catch (e) { next(e); }
}
