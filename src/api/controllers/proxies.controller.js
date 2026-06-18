import ProxyService from '../../core/proxies/ProxyService.js';
import db from '../../db/connection.js';
import { parseProxyText } from '../../utils/proxy-parser.js';

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

/**
 * Bulk import proxies from a plain text file content.
 * Supports multiple common credential formats (see proxy-parser.js).
 * POST body: { text: "...", defaultType?: "socks5"|"http", namePrefix?: string, region?: string }
 */
export async function importProxies(req, res, next) {
  try {
    const { text, defaultType = 'socks5', namePrefix = '', region } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text (proxy list content) is required' });
    }

    const svc = getProxyService();
    const candidates = parseProxyText(text, { defaultType, namePrefix, region });

    const results = { imported: 0, skipped: 0, errors: [], created: [] };

    // Simple dedup against existing (host+port)
    const existing = await db('proxies').select('host', 'port');
    const existingKeys = new Set(existing.map(e => `${e.host}:${e.port}`));

    for (const c of candidates) {
      const key = `${c.host}:${c.port}`;
      if (existingKeys.has(key)) {
        results.skipped++;
        continue;
      }

      try {
        const created = await svc.createProxy(c);
        results.imported++;
        results.created.push({ id: created.id, name: created.name, host: created.host, port: created.port });
        existingKeys.add(key); // prevent dups within this batch too
      } catch (err) {
        results.errors.push({ item: c, error: err.message });
      }
    }

    res.status(201).json({
      data: results,
      message: `Imported ${results.imported}, skipped ${results.skipped} duplicates, ${results.errors.length} errors.`
    });
  } catch (e) { next(e); }
}
