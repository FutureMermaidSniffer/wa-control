/**
 * WhatsApp JID helpers — phone numbers vs privacy LIDs.
 * Tuned for Baileys 6.7.x (senderPn / participantPn).
 */

/** @param {string|null|undefined} jid */
export function isLidJid(jid) {
  return typeof jid === 'string' && jid.endsWith('@lid');
}

/** @param {string|null|undefined} jid */
export function isPhoneJid(jid) {
  return typeof jid === 'string' && (jid.endsWith('@s.whatsapp.net') || jid.endsWith('@c.us'));
}

/** @param {string|null|undefined} jid */
export function isGroupJid(jid) {
  return typeof jid === 'string' && jid.includes('@g.us');
}

/**
 * User part of a JID (digits / lid id), no device suffix.
 * @param {string|null|undefined} jidOrUser
 * @returns {string|null}
 */
export function jidUser(jidOrUser) {
  if (jidOrUser == null || jidOrUser === '') return null;
  let s = String(jidOrUser).trim();
  if (s.includes('@')) s = s.split('@')[0];
  s = s.replace(/:\d+$/, '').replace(/[^\d]/g, '');
  return s || null;
}

/**
 * Heuristic: WA LID user ids are long numeric strings (typically 15+ digits).
 * @param {string|null|undefined} digits
 */
export function looksLikeLidDigits(digits) {
  const d = String(digits || '').replace(/\D/g, '');
  return d.length >= 15;
}

/**
 * Pull a phone-looking JID out of candidates.
 * @param {Array<string|null|undefined>} candidates
 * @returns {string|null}
 */
function firstPhoneJid(candidates) {
  for (const c of candidates) {
    if (typeof c !== 'string' || !c) continue;
    if (c.includes('@s.whatsapp.net') || c.includes('@c.us')) {
      const u = jidUser(c);
      if (u) return `${u}@s.whatsapp.net`;
    }
    if (!c.includes('@')) {
      const u = c.replace(/\D/g, '');
      if (u.length >= 8 && u.length <= 15) return `${u}@s.whatsapp.net`;
    }
  }
  return null;
}

/**
 * Prefer a real phone JID over @lid when Baileys provides PN fields.
 * @param {object} msg - Baileys WAMessage
 */
export function extractPeer(msg) {
  if (!msg?.key) {
    return {
      jid: null,
      sendJid: null,
      phone: null,
      lid: null,
      isLid: false,
      isGroup: false,
      groupJid: null,
      pushName: null,
      displayId: '?',
    };
  }

  const key = msg.key;
  const remote = key.remoteJid || null;
  const isGroup = isGroupJid(remote);

  const pnCandidates = [
    key.remoteJidAlt,
    key.participantAlt,
    key.senderPn,
    key.participantPn,
    msg.senderPn,
    isLidJid(remote) ? key.participant : null,
  ].filter(Boolean);

  const phoneJid = firstPhoneJid(pnCandidates);

  let lidUser = null;
  if (isLidJid(remote)) lidUser = jidUser(remote);
  if (!lidUser && key.senderLid) lidUser = jidUser(key.senderLid);
  if (!lidUser && key.participantLid) lidUser = jidUser(key.participantLid);
  if (!lidUser && isLidJid(key.participant)) lidUser = jidUser(key.participant);

  let preferred = remote;
  if (!isGroup && phoneJid) preferred = phoneJid;
  else if (!isGroup && isLidJid(remote)) preferred = remote;

  const isLidOnly = !isGroup && !phoneJid && !!(preferred && isLidJid(preferred));

  let resolvedPhone = phoneJid ? jidUser(phoneJid) : null;
  if (!resolvedPhone && isPhoneJid(remote)) resolvedPhone = jidUser(remote);
  if (!resolvedPhone && isPhoneJid(preferred)) resolvedPhone = jidUser(preferred);

  const lid = lidUser || (isLidOnly ? jidUser(preferred) : null);

  const pushName = (!key.fromMe && msg.pushName)
    ? String(msg.pushName).trim()
    : null;

  let displayId = '?';
  if (resolvedPhone) displayId = `+${resolvedPhone}`;
  else if (lid) displayId = pushName || `LID ${String(lid).slice(0, 10)}…`;
  else if (isGroup) displayId = 'Group';

  const sendJid = isGroup
    ? remote
    : (resolvedPhone
      ? `${resolvedPhone}@s.whatsapp.net`
      : (lid ? `${lid}@lid` : preferred));

  return {
    jid: preferred || remote,
    sendJid: sendJid || null,
    phone: resolvedPhone || null,
    lid: lid || null,
    isLid: !resolvedPhone && !!lid,
    isGroup,
    groupJid: isGroup ? remote : null,
    pushName,
    displayId,
  };
}

/**
 * Format a desk message line.
 */
export function formatDeskLine({ direction, phone, name, text, isLid }) {
  const body = text || '[media]';
  if (direction === 'out' || direction === '→') {
    return `→ You: ${body}`;
  }
  const who = name
    ? (phone ? `${name} (+${String(phone).replace(/^\+/, '')})` : name)
    : (phone
      ? (isLid ? `LID ${String(phone).slice(0, 10)}…` : `+${String(phone).replace(/^\+/, '')}`)
      : 'Unknown');
  return `← ${who}: ${body}`;
}

export default {
  extractPeer,
  formatDeskLine,
  isLidJid,
  isPhoneJid,
  isGroupJid,
  jidUser,
  looksLikeLidDigits,
};
