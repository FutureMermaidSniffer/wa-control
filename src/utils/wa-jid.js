/**
 * WhatsApp JID helpers — phone numbers vs privacy LIDs.
 * No third-party API: use Baileys key fields only.
 */

/**
 * Prefer a real phone JID (@s.whatsapp.net / @c.us) over @lid when Baileys provides alt fields.
 * @param {object} msg - Baileys WAMessage
 * @returns {{ jid: string|null, phone: string|null, isLid: boolean, pushName: string|null, displayId: string }}
 */
export function extractPeer(msg) {
  if (!msg?.key) {
    return { jid: null, phone: null, isLid: false, pushName: null, displayId: '?' };
  }

  const key = msg.key;
  const remote = key.remoteJid || null;
  // Baileys versions expose PN in different places when primary is LID
  const altCandidates = [
    key.remoteJidAlt,
    key.participantAlt,
    key.participantPn,
    key.senderPn,
    msg.senderPn,
    msg.participant,
  ].filter(Boolean);

  let preferred = remote;
  for (const c of altCandidates) {
    if (typeof c === 'string' && (c.includes('@s.whatsapp.net') || c.includes('@c.us'))) {
      preferred = c;
      break;
    }
  }

  // Group messages: participant may be the real sender
  if (remote?.includes('@g.us')) {
    const part = key.participant || key.participantAlt || key.participantPn;
    if (part) preferred = part;
  }

  const isLid = !!(preferred && preferred.endsWith('@lid'));
  const isGroup = !!(remote && remote.includes('@g.us'));
  let phone = null;
  if (preferred) {
    phone = preferred
      .replace(/@.*/, '')
      .replace(/:\d+$/, '')
      .replace(/[^\d+]/g, '');
    // Keep leading + only if original had country formatting; digits-only is fine for storage
    if (phone.startsWith('+')) phone = phone.slice(1);
  }

  const pushName = (!key.fromMe && msg.pushName)
    ? String(msg.pushName).trim()
    : null;

  // Human-facing id for desk when we only have LID
  let displayId = phone || '?';
  if (isLid && phone) {
    displayId = pushName ? `${pushName}` : `LID ${phone.slice(0, 8)}…`;
  } else if (phone && phone.length >= 8) {
    displayId = phone.startsWith('+') ? phone : `+${phone}`;
  }

  return {
    jid: preferred || remote,
    phone: phone || null,
    isLid,
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

export default { extractPeer, formatDeskLine };
