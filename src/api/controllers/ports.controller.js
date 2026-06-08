import portsData from '../../data/ports.data.js';

export async function listPorts(req, res, next) {
  try {
    const ports = await portsData.listPorts(req.query);
    res.json({ data: ports });
  } catch (e) { next(e); }
}

export async function purchasePort(req, res, next) {
  try {
    const { type = 'normal', notes, expiresInDays = 365 } = req.body;
    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + expiresInDays * 86400000);

    const port = await portsData.createPort({
      type,
      starts_at: startsAt,
      expires_at: expiresAt,
      notes: notes || `Purchased internally for tracking (${type})`,
      status: 'active',
    });

    res.status(201).json({ data: port });
  } catch (e) { next(e); }
}

export async function getPort(req, res, next) {
  try {
    const port = await portsData.getPortById(req.params.id);
    if (!port) return res.status(404).json({ error: 'Port not found' });
    res.json({ data: port });
  } catch (e) { next(e); }
}
