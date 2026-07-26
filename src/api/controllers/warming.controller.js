import warmingData from '../../data/warming.data.js';
import wsAccountsData from '../../data/wsAccounts.data.js';
import { logger } from '../../utils/logger.js';
import { scheduleWarmingTask } from '../../jobs/queues.js';
import { sessionsPerDayForProgress } from '../../core/warming/schedule.js';

export async function listWarming(req, res, next) {
  try {
    const tasks = await warmingData.listWarmingTasks(req.query);
    // Enrich with session plan fields for UI
    const data = tasks.map((t) => {
      const perDay = sessionsPerDayForProgress({
        mode: t.mode,
        targetDays: t.target_days,
        progressDays: t.progress_days,
        override: t.sessions_per_day,
      });
      return {
        ...t,
        sessions_per_day_effective: perDay,
        session_label: `Day ${(t.progress_days || 0) + 1} · session ${Math.min((t.sessions_completed_today || 0) + 1, perDay)}/${perDay}`,
      };
    });
    res.json({ data });
  } catch (e) { next(e); }
}

export async function enterWarmingPool(req, res, next) {
  try {
    const {
      ws_account_id,
      mode = 'normal',
      target_days = 10,
      sessions_per_day,
    } = req.body;
    if (!ws_account_id) return res.status(400).json({ error: 'ws_account_id required' });

    const acc = await wsAccountsData.findById(ws_account_id);
    if (!acc) return res.status(404).json({ error: 'Account not found' });

    // Allow warming for accounts that are linked (just paired via Baileys), offline, active, or in error.
    // Previously only 'offline' was accepted — this blocked warming right after a successful link.
    const warmingEligible = ['offline', 'linked', 'active', 'error', 'primary_registered'];
    if (!warmingEligible.includes(acc.status)) {
      return res.status(400).json({
        error: `Account status '${acc.status}' is not eligible for warming. Must be one of: ${warmingEligible.join(', ')}`,
      });
    }

    const days = Math.max(1, parseInt(target_days, 10) || 10);
    const task = await warmingData.createWarmingTask({
      ws_account_id,
      mode: mode === 'fast_warm' ? 'fast_warm' : 'normal',
      target_days: days,
      status: 'pending',
      progress_days: 0,
      sessions_completed_today: 0,
      ...(sessions_per_day != null && Number(sessions_per_day) > 0
        ? { sessions_per_day: Math.min(6, parseInt(sessions_per_day, 10)) }
        : {}),
    });

    // First bootstrap session soon; later sessions use real calendar gaps from the worker.
    const initialDelay = mode === 'fast_warm' ? 1000 : 5000;
    await scheduleWarmingTask(task.id, initialDelay).catch((e) => logger.warn('schedule warm failed', e));

    res.status(201).json({ data: task });
  } catch (e) { next(e); }
}

export async function updateWarmingTask(req, res, next) {
  try {
    const { id } = req.params;
    const patch = {};
    ['status', 'progress_days', 'notes', 'sessions_completed_today'].forEach((k) => {
      if (k in req.body) patch[k] = req.body[k];
    });
    await warmingData.updateTask(id, patch);
    const updated = await warmingData.getTask(id);

    // Resume: re-queue a session when moving back to executing
    if (patch.status === 'executing' || patch.status === 'pending') {
      await scheduleWarmingTask(id, 2000).catch((e) => logger.warn('resume schedule failed', e));
    }

    res.json({ data: updated });
  } catch (e) { next(e); }
}

export async function pauseWarming(req, res, next) {
  try {
    await warmingData.updateTask(req.params.id, { status: 'paused' });
    res.json({ success: true });
  } catch (e) { next(e); }
}
