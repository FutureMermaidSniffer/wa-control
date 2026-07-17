/**
 * Canonical WhatsApp phone numbers: country-code digits only.
 * Never pass "+" / spaces / dashes into Baileys requestPairingCode or JIDs.
 *
 * "+254 792 217 761" → "254792217761"
 * "254-792-217-761"  → "254792217761"
 */

/**
 * @param {string|number|null|undefined} input
 * @param {{ requireCountry?: boolean, throwOnInvalid?: boolean }} [opts]
 * @returns {string} digits only
 */
export function normalizeWaPhone(input, { requireCountry = true, throwOnInvalid = true } = {}) {
  let s = String(input ?? '').trim();
  // Drop everything except digits and a leading +
  s = s.replace(/[^\d+]/g, '');
  if (s.startsWith('+')) s = s.slice(1);
  // Any remaining non-digits (e.g. middle +)
  s = s.replace(/\D/g, '');

  // Common Kenya-style mistake: 2540… (country + trunk 0)
  if (/^2540\d+/.test(s)) {
    const msg = `Phone looks wrong (${s}): drop the 0 after country code (use 2547… not 25407…).`;
    if (throwOnInvalid) throw new Error(msg);
    return s;
  }

  if (requireCountry && (s.length < 10 || s.length > 15)) {
    const msg =
      `Invalid phone "${input}" → "${s}". ` +
      `Use full international digits with country code, e.g. 254712345678 (leading + is OK; we strip it).`;
    if (throwOnInvalid) throw new Error(msg);
    return s;
  }

  return s;
}

/**
 * Human display only — never send to Baileys.
 * @param {string|null|undefined} digits
 */
export function formatPhoneDisplay(digits) {
  if (digits == null || digits === '') return '';
  const d = String(digits).replace(/\D/g, '');
  return d ? `+${d}` : '';
}

/**
 * Legible international format: +254 792 217 761
 * Heuristic CC (not full libphonenumber).
 */
export function formatPhonePretty(raw) {
  const d = String(raw ?? '').replace(/\D/g, '');
  if (!d) return '—';
  if (d.length < 10) return `+${d}`;
  // NANP
  if (d.startsWith('1') && d.length === 11) {
    return `+1 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
  }
  // Common 3-digit CC (KE 254, NGA 234, …) when total length ≥ 12
  const ccLen = d.length >= 12 ? 3 : d.length === 11 ? 2 : 2;
  const cc = d.slice(0, ccLen);
  const rest = d.slice(ccLen).replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  return `+${cc} ${rest}`;
}

/**
 * Build chat JID from any phone input.
 * @param {string} input phone or already a jid
 */
export function toWaJid(input) {
  const raw = String(input ?? '').trim();
  if (raw.includes('@')) {
    const [user, server] = raw.split('@');
    const digits = normalizeWaPhone(user, { requireCountry: false, throwOnInvalid: false });
    return `${digits}@${server || 's.whatsapp.net'}`;
  }
  const digits = normalizeWaPhone(raw);
  return `${digits}@s.whatsapp.net`;
}

export default { normalizeWaPhone, formatPhoneDisplay, toWaJid };
