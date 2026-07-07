/**
 * Proxy credential text parser.
 * Supports common formats from residential/ISP providers:
 *   - user:pass@host:port          (most common, e.g. proxy-cheap, iproyal style)
 *   - host:port:user:pass
 *   - user:pass:host:port
 *   - host:port (no auth)
 *   - With optional protocol prefix (socks5:// or http://) to hint type
 *
 * Returns array of objects ready for ProxyService.createProxy / POST /proxies
 * { name?, type, host, port, username?, password? }
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
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#') && !l.startsWith('//'));

  const seen = new Set();
  const results = [];

  for (const line of lines) {
    let proxy = null;

    // Remove protocol prefix if present and use it to set type
    let working = line;
    let hintedType = null;
    const protoMatch = working.match(/^(socks5?|http|https):\/\//i);
    if (protoMatch) {
      const proto = protoMatch[1].toLowerCase();
      if (proto === 'socks5' || proto === 'socks') hintedType = 'socks5';
      else if (proto === 'http' || proto === 'https') hintedType = 'http';
      working = working.replace(protoMatch[0], '');
    }

    // Format 1: user:pass@host:port
    let m = working.match(/^([^:@]+):([^@]+)@([^:@]+):(\d{2,5})$/);
    if (m) {
      proxy = {
        username: m[1],
        password: m[2],
        host: m[3],
        port: parseInt(m[4], 10),
      };
    }

    // Format 2: host:port:user:pass
    if (!proxy) {
      m = working.match(/^([^:@]+):(\d{2,5}):([^:@]+):([^:@]+)$/);
      if (m) {
        proxy = {
          host: m[1],
          port: parseInt(m[2], 10),
          username: m[3],
          password: m[4],
        };
      }
    }

    // Format 3: user:pass:host:port
    if (!proxy) {
      m = working.match(/^([^:@]+):([^:@]+):([^:@]+):(\d{2,5})$/);
      if (m) {
        proxy = {
          username: m[1],
          password: m[2],
          host: m[3],
          port: parseInt(m[4], 10),
        };
      }
    }

    // Format 4: just host:port (public or env-auth proxies)
    if (!proxy) {
      m = working.match(/^([^:@]+):(\d{2,5})$/);
      if (m) {
        proxy = {
          host: m[1],
          port: parseInt(m[2], 10),
        };
      }
    }

    if (!proxy || !proxy.host || !proxy.port) {
      // Unknown format – skip or log in caller
      continue;
    }

    const type = hintedType || defaultType;

    // Dedup key (host:port)
    const key = `${proxy.host}:${proxy.port}`;
    if (seen.has(key)) continue;
    seen.add(key);

    // Auto name
    const baseName = proxy.username
      ? `${proxy.host.split('.')[0]}-${proxy.port}`
      : `${proxy.host.split('.')[0]}-${proxy.port}`;
    const name = namePrefix ? `${namePrefix}${baseName}` : baseName;

    const item = {
      name,
      type,
      host: proxy.host,
      port: proxy.port,
    };

    if (proxy.username) item.username = proxy.username;
    if (proxy.password) item.password = proxy.password;
    if (region) item.region = region;

    results.push(item);
  }

  return results;
}

export default { parseProxyText };
