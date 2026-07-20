/**
 * Proxy credential text parser.
 *
 * Supported line formats (auto-detected per line):
 *   1. ip:port                          e.g. 91.132.137.186:10158
 *   2. ip:port:username:password        e.g. 91.132.137.186:10158:user:pass
 *   3. USERNAME:PASSWORD@IP:PORT        e.g. user:pass@91.132.137.186:10158
 *
 * Also accepted (extra):
 *   - user:pass:host:port
 *   - Optional protocol prefix (socks5:// or http:// / https://) to hint type
 *
 * Returns array of objects ready for ProxyService.createProxy / POST /proxies
 * { name?, type, host, port, username?, password?, format? }
 */

/** @typedef {'ip:port' | 'ip:port:user:pass' | 'user:pass@ip:port' | 'user:pass:ip:port'} ProxyFormat */

/**
 * Parse a single proxy line (no protocol stripping done by caller).
 * @returns {{ host: string, port: number, username?: string, password?: string, format: ProxyFormat } | null}
 */
export function parseProxyLine(rawLine) {
  if (!rawLine || typeof rawLine !== 'string') return null;

  let working = rawLine.trim();
  if (!working || working.startsWith('#') || working.startsWith('//')) return null;

  // Optional protocol → used only as type hint by parseProxyText
  let hintedType = null;
  const protoMatch = working.match(/^(socks5?|http|https):\/\//i);
  if (protoMatch) {
    const proto = protoMatch[1].toLowerCase();
    if (proto === 'socks5' || proto === 'socks') hintedType = 'socks5';
    else if (proto === 'http' || proto === 'https') hintedType = 'http';
    working = working.slice(protoMatch[0].length);
  }

  // Host: IPv4 or hostname (no @ or unencoded spaces)
  // Username/password: non-empty, may include many special chars except delimiters used by that format
  let m;
  let proxy = null;

  // Format 3 (user request): USERNAME:PASSWORD@IP:PORT
  // Prefer this when @ is present so passwords with : still work as long as they have no @.
  m = working.match(/^([^@\s:]+):([^@\s]+)@([^@\s:\/]+):(\d{2,5})$/);
  if (m) {
    proxy = {
      username: m[1],
      password: m[2],
      host: m[3],
      port: parseInt(m[4], 10),
      format: /** @type {ProxyFormat} */ ('user:pass@ip:port'),
    };
  }

  // Format 2 (user request): ip:port:username:password
  // Port is strictly numeric so we can distinguish from user:pass:host:port.
  if (!proxy) {
    m = working.match(/^([^@\s:\/]+):(\d{2,5}):([^:\s]+):(.+)$/);
    if (m) {
      proxy = {
        host: m[1],
        port: parseInt(m[2], 10),
        username: m[3],
        password: m[4],
        format: /** @type {ProxyFormat} */ ('ip:port:user:pass'),
      };
    }
  }

  // Extra: user:pass:host:port (common alternate dump format)
  if (!proxy) {
    m = working.match(/^([^:\s]+):([^:\s]+):([^@\s:\/]+):(\d{2,5})$/);
    if (m) {
      proxy = {
        username: m[1],
        password: m[2],
        host: m[3],
        port: parseInt(m[4], 10),
        format: /** @type {ProxyFormat} */ ('user:pass:ip:port'),
      };
    }
  }

  // Format 1 (user request): ip:port (no auth)
  if (!proxy) {
    m = working.match(/^([^@\s:\/]+):(\d{2,5})$/);
    if (m) {
      proxy = {
        host: m[1],
        port: parseInt(m[2], 10),
        format: /** @type {ProxyFormat} */ ('ip:port'),
      };
    }
  }

  if (!proxy || !proxy.host || !proxy.port) return null;
  if (proxy.port < 1 || proxy.port > 65535) return null;

  return { ...proxy, hintedType };
}

/**
 * Parse multi-line proxy list text.
 * @param {string} text
 * @param {{ defaultType?: string, namePrefix?: string, region?: string|null }} [options]
 * @returns {Array<{ name: string, type: string, host: string, port: number, username?: string, password?: string, region?: string, format: string }>}
 */
export function parseProxyText(text, options = {}) {
  const {
    defaultType = 'socks5',
    namePrefix = '',
    region = null,
  } = options;

  if (!text || typeof text !== 'string') return [];

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('//'));

  const seen = new Set();
  const results = [];

  for (const line of lines) {
    const parsed = parseProxyLine(line);
    if (!parsed) continue;

    const type = parsed.hintedType || defaultType;
    const key = `${parsed.host}:${parsed.port}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const baseName = `${String(parsed.host).split('.')[0]}-${parsed.port}`;
    const name = namePrefix ? `${namePrefix}${baseName}` : baseName;

    const item = {
      name,
      type,
      host: parsed.host,
      port: parsed.port,
      format: parsed.format,
    };

    if (parsed.username) item.username = parsed.username;
    if (parsed.password) item.password = parsed.password;
    if (region) item.region = region;

    results.push(item);
  }

  return results;
}

/**
 * Detailed parse: candidates + invalid/skipped raw lines (for UI feedback).
 * @param {string} text
 * @param {{ defaultType?: string, namePrefix?: string, region?: string|null }} [options]
 */
export function parseProxyTextDetailed(text, options = {}) {
  if (!text || typeof text !== 'string') {
    return { proxies: [], invalidLines: [], formatCounts: {}, totalLines: 0 };
  }

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('//'));

  const seen = new Set();
  const proxies = [];
  const invalidLines = [];
  const formatCounts = {
    'ip:port': 0,
    'ip:port:user:pass': 0,
    'user:pass@ip:port': 0,
    'user:pass:ip:port': 0,
  };

  const {
    defaultType = 'socks5',
    namePrefix = '',
    region = null,
  } = options;

  for (const line of lines) {
    const parsed = parseProxyLine(line);
    if (!parsed) {
      invalidLines.push(line);
      continue;
    }

    const type = parsed.hintedType || defaultType;
    const key = `${parsed.host}:${parsed.port}`;
    if (seen.has(key)) {
      // silent dedup within the paste; still counts as detected format
      if (formatCounts[parsed.format] != null) formatCounts[parsed.format] += 1;
      continue;
    }
    seen.add(key);

    if (formatCounts[parsed.format] != null) formatCounts[parsed.format] += 1;

    const baseName = `${String(parsed.host).split('.')[0]}-${parsed.port}`;
    const name = namePrefix ? `${namePrefix}${baseName}` : baseName;

    const item = {
      name,
      type,
      host: parsed.host,
      port: parsed.port,
      format: parsed.format,
    };
    if (parsed.username) item.username = parsed.username;
    if (parsed.password) item.password = parsed.password;
    if (region) item.region = region;

    proxies.push(item);
  }

  return {
    proxies,
    invalidLines,
    formatCounts,
    totalLines: lines.length,
  };
}

export default { parseProxyText, parseProxyLine, parseProxyTextDetailed };
