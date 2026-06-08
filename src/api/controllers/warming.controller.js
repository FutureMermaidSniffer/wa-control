import warmingData from '../../data/warming.data.js';
import wsAccountsData from '../../data/wsAccounts.data.js';
import { logger } from '../../utils/logger.js';
import { scheduleWarmingTask } from '../../jobs/queues.js';

export async function listWarming(req, res, next) {
  try {
    const tasks = await warmingData.listWarmingTasks(req.query);
    res.json({ data: tasks });
  } catch (e) { next(e); }
}

export async function enterWarmingPool(req, res, next) {
  try {
    const { ws_account_id, mode = 'normal', target_days = 10 } = req.body;
    if (!ws_account_id) return res.status(400).json({ error: 'ws_account_id required' });

    const acc = await wsAccountsData.findById(ws_account_id);
    if (!acc) return res.status(404).json({ error: 'Account not found' });
    if (acc.status !== 'offline') {
      return res.status(400).json({ error: 'Account must be offline to enter warming pool' });
    }

    const task = await warmingData.createWarmingTask({
      ws_account_id,
      mode,
      target_days,
      status: 'pending',
      progress_days: 0,
    });

    // Kick off first execution step. Normal: slightly delayed, fast_warm: quicker start (but still throttled in worker)
    const initialDelay = mode === 'fast_warm' ? 1000 : 5000;
    await scheduleWarmingTask(task.id, initialDelay).catch((e) => logger.warn('schedule warm failed', e));

    res.status(201).json({ data: task });
  } catch (e) { next(e); }
}

export async function updateWarmingTask(req, res, next) {
  try {
    const { id } = req.params;
    const patch = {};
    ['status', 'progress_days', 'notes'].forEach(k => { if (k in req.body) patch[k] = req.body[k]; });
    await warmingData.updateTask(id, patch);
    const updated = await warmingData.getTask(id);
    res.json({ data: updated });
  } catch (e) { next(e); }
}

export async function pauseWarming(req, res, next) {
  try {
    await warmingData.updateTask(req.params.id, { status: 'paused' });
    res.json({ success: true });
  } catch (e) { next(e); }
}
