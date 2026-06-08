import ProxyService from '../../core/proxies/ProxyService.js';
import db from '../../db/connection.js';

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
