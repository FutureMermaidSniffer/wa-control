import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseProxyLine,
  parseProxyText,
  parseProxyTextDetailed,
} from '../src/utils/proxy-parser.js';

describe('parseProxyLine — 3 primary formats', () => {
  it('detects ip:port', () => {
    const p = parseProxyLine('91.132.137.186:10158');
    assert.ok(p);
    assert.equal(p.host, '91.132.137.186');
    assert.equal(p.port, 10158);
    assert.equal(p.format, 'ip:port');
    assert.equal(p.username, undefined);
  });

  it('detects ip:port:username:password', () => {
    const p = parseProxyLine('91.132.137.186:10448:6uLZMyY1yQShFW7:IE53rQe3SsWvgxn');
    assert.ok(p);
    assert.equal(p.host, '91.132.137.186');
    assert.equal(p.port, 10448);
    assert.equal(p.username, '6uLZMyY1yQShFW7');
    assert.equal(p.password, 'IE53rQe3SsWvgxn');
    assert.equal(p.format, 'ip:port:user:pass');
  });

  it('detects USERNAME:PASSWORD@IP:PORT', () => {
    const p = parseProxyLine('6uLZMyY1yQShFW7:IE53rQe3SsWvgxn@91.132.137.186:10453');
    assert.ok(p);
    assert.equal(p.host, '91.132.137.186');
    assert.equal(p.port, 10453);
    assert.equal(p.username, '6uLZMyY1yQShFW7');
    assert.equal(p.password, 'IE53rQe3SsWvgxn');
    assert.equal(p.format, 'user:pass@ip:port');
  });

  it('strips protocol prefix and sets hintedType', () => {
    const p = parseProxyLine('socks5://user:pass@1.2.3.4:1080');
    assert.ok(p);
    assert.equal(p.hintedType, 'socks5');
    assert.equal(p.format, 'user:pass@ip:port');
  });

  it('rejects garbage', () => {
    assert.equal(parseProxyLine('not-a-proxy'), null);
    assert.equal(parseProxyLine(''), null);
  });
});

describe('parseProxyText mixed list', () => {
  const mixed = `
# comment
91.132.137.186:10158
91.132.137.186:10448:user1:pass1
user2:pass2@91.132.137.186:10453
http://user3:pass3@91.132.137.186:10480
bad line here
`;

  it('parses all three formats in one paste', () => {
    const list = parseProxyText(mixed, { defaultType: 'socks5', region: 'us' });
    assert.equal(list.length, 4);
    assert.equal(list[0].format, 'ip:port');
    assert.equal(list[1].format, 'ip:port:user:pass');
    assert.equal(list[2].format, 'user:pass@ip:port');
    assert.equal(list[3].type, 'http'); // protocol hint
    assert.equal(list[0].region, 'us');
  });

  it('reports invalid lines in detailed parse', () => {
    const d = parseProxyTextDetailed(mixed);
    assert.equal(d.proxies.length, 4);
    assert.ok(d.invalidLines.some((l) => l.includes('bad line')));
    assert.equal(d.formatCounts['ip:port'], 1);
    assert.equal(d.formatCounts['ip:port:user:pass'], 1);
    assert.equal(d.formatCounts['user:pass@ip:port'], 2);
  });
});
