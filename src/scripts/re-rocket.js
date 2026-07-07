#!/usr/bin/env node
/**
 * Rocket WS Cloud Control (pn3.rocketgo.vip) Reverse Engineering Client
 *
 * Goal: Mimic real client interactions to discover backend logic, API shapes,
 * auth, chat/newchat flows, accounts, ports, realtime, etc. to improve local wa-control.
 *
 * Usage examples:
 *   node src/scripts/re-rocket.js captcha
 *   node src/scripts/re-rocket.js login --user ZT011 --pass ss123123 --code XXXX --uuid <from-captcha>
 *   node src/scripts/re-rocket.js explore
 *   node src/scripts/re-rocket.js get-accounts
 *
 * After successful login a .rocket-session.json is written with token.
 * You can also paste a raw Cookie or Authorization header.
 *
 * The script focuses on backend APIs (no browser). For captcha you run the "captcha" step,
 * open the saved image or describe, enter the visible chars, then login step.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import readline from 'readline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.ROCKET_BASE || 'https://hf4cs.rocketgo.vip';
const API_BASE = process.env.ROCKET_API_BASE || '/prod-api'; // from bundle: baseURL:"/prod-api"
const SESSION_FILE = path.join(__dirname, '../../.rocket-session.json');

let session = { token: null, cookies: [], user: null };

function loadSession() {
  try {
    if (fs.existsSync(SESSION_FILE)) {
      session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
    }
  } catch {}
}
function saveSession() {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(session, null, 2));
}

function getHeaders(extra = {}) {
  const h = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Referer': BASE + '/chat/newchat',
    ...extra
  };
  if (session.token) {
    h['Authorization'] = `Bearer ${session.token}`;
    // Some panels also accept raw token header:
    // h['token'] = session.token;
  }
  if (session.cookies && session.cookies.length) {
    h['Cookie'] = session.cookies.join('; ');
  }
  return h;
}

// Use curl for all HTTP (more reliable in this env, handles CF headers + cookies easily).
function buildCurlHeaders(h) {
  return Object.entries(h).map(([k, v]) => `-H "${k}: ${String(v).replace(/"/g, '\\"')}"`).join(' ');
}

async function http(method, url, body = null, extraHeaders = {}) {
  let full;
  if (url.startsWith('http')) {
    full = url;
  } else if (url.startsWith('/prod-api') || url.startsWith('/api/')) {
    full = BASE + url;
  } else {
    full = BASE + API_BASE + (url.startsWith('/') ? url : '/' + url);
  }
  const hdrs = getHeaders(extraHeaders);
  let cmd = `curl -sS -i -X ${method} ${buildCurlHeaders(hdrs)} `;

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    const b = typeof body === 'string' ? body : JSON.stringify(body);
    // escape for shell
    const safe = b.replace(/'/g, "'\\''");
    cmd += ` -d '${safe}' `;
  }
  cmd += ` '${full}' `;

  // Run curl, capture full output (headers + body)
  const { execSync } = await import('child_process');
  let raw;
  try {
    raw = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    raw = (e.stdout || '') + (e.stderr || '');
  }

  // Split headers / body (curl -i)
  const parts = raw.split(/\r?\n\r?\n/);
  let headersRaw = parts[0] || '';
  let bodyText = parts.slice(1).join('\n\n');

  // Parse status
  const statusMatch = headersRaw.match(/HTTP\/[^\s]+\s+(\d+)/);
  const status = statusMatch ? parseInt(statusMatch[1], 10) : 0;

  // Capture set-cookie lines
  const setCookies = [];
  headersRaw.split(/\r?\n/).forEach(line => {
    const m = line.match(/^set-cookie:\s*(.+)$/i);
    if (m) setCookies.push(m[1].split(';')[0].trim());
  });
  if (setCookies.length) {
    session.cookies = setCookies;
  }

  let json = null;
  const trimmed = (bodyText || '').trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try { json = JSON.parse(trimmed); } catch {}
  }

  if (status >= 400) {
    console.warn(`[HTTP ${status}] ${method} ${url}`);
  }
  return {
    status,
    ok: status >= 200 && status < 300,
    json: json || (trimmed ? { rawBody: trimmed.slice(0, 2000) } : null),
    text: trimmed,
    headersRaw
  };
}

// === CAPTCHA ===
async function fetchCaptcha() {
  const uuid = crypto.randomUUID ? crypto.randomUUID() : ('u-' + Date.now() + '-' + Math.random().toString(36).slice(2));
  console.log('Generated uuid for captcha:', uuid);

  // Try common captcha endpoints used by this style of panel
  const candidates = [
    `/captchaImage?uuid=${uuid}`,
    `/captchaImage?code=${uuid}`,
    `/code?uuid=${uuid}`,
  ];

  let last;
  for (const u of candidates) {
    const r = await http('GET', u);
    last = r;
    if (r.ok && (r.json.img || r.json.captcha || r.json.image)) {
      const imgData = r.json.img || r.json.image || r.json.captcha;
      // Save as data url or base64 png
      const out = path.join(__dirname, '../../captcha-current.png');
      if (imgData.startsWith('data:')) {
        const b64 = imgData.split(',')[1];
        fs.writeFileSync(out, Buffer.from(b64, 'base64'));
      } else if (/^[A-Za-z0-9+/=]+$/.test(imgData) && imgData.length > 100) {
        fs.writeFileSync(out, Buffer.from(imgData, 'base64'));
      }
      console.log('Captcha image saved to:', out);
      console.log('Server response keys:', Object.keys(r.json));
      return { uuid, data: r.json, path: out };
    }
  }
  console.log('Captcha fetch response (last):', last);
  return { uuid, data: last?.json };
}

// === LOGIN ===
async function doLogin({ username, password, code, uuid, khUsername }) {
  const payload = {
    username: username || 'ZT011',
    password: password || 'ss123123',
    code: code || '',
    uuid: uuid || '',
  };
  if (khUsername) payload.khUsername = khUsername;

  console.log('POST /login payload (sanitized):', { ...payload, password: '***', code: code ? '****' : '' });

  const r = await http('POST', '/login', payload);

  // Common response shapes in these panels:
  // { code: 200, msg: 'ok', token: 'ey...' }
  // or { token }
  // or data: { token }
  console.log('Login raw response code:', r.status);
  const root = r.json || {};
  const data = root.data || root;
  const token = root.token || data.token || data.accessToken || root.access_token || root.jwt || data.jwt;
  if (token) {
    session.token = token;
    session.user = root.user || data.user || root.sysUser || null;
    saveSession();
    console.log('LOGIN SUCCESS. Token captured (first 25):', String(token).slice(0, 25) + '...');
    console.log('Saved session to', SESSION_FILE);
  } else {
    console.log('Login response (no token found):');
    console.dir(root, { depth: 1 });
  }
  return r;
}

async function getInfo() {
  const r = await http('GET', '/getInfo');
  console.log('GET /getInfo ->', r.status);
  if (r.json) console.dir(r.json, { depth: 2 });
  return r;
}

// === DISCOVERY HELPERS ===
// Try common patterns seen in similar panels + from bundle strings
const ACCOUNT_LIST_CANDIDATES = [
  '/system/user/list',
  '/biz/account/list',
  '/account/list',
  '/wsAccount/list',
  '/setting/account/list',
  '/customer/account/list',
  '/api/account/list',
];

const PORT_CANDIDATES = [
  '/portStatistics',
  '/setting/account/userport',
  '/port/list',
  '/biz/port/list',
  '/account/port',
];

const CHAT_CANDIDATES = [
  '/chat/list',
  '/biz/chat/list',
  '/customerservice/list',
  '/biz/customerservice/session',
  '/newchat/session',
  '/chat/session/list',
  '/session/list',
  '/biz/friends/list',
  '/biz/maintenance/getPortInfo',
  '/biz/maintenance/getSocksInfo',
  '/biz/main/getLine',
];

async function tryList(candidates, label) {
  console.log(`\n=== Probing ${label} ===`);
  for (const p of candidates) {
    const r = await http('GET', p);
    const hasList = r.json && (r.json.rows || r.json.list || r.json.data || Array.isArray(r.json));
    const snippet = hasList ? ' (has list data)' : '';
    console.log(`  ${p} -> ${r.status}${snippet}`);
    if (r.status === 200 && hasList) {
      const data = r.json;
      console.log('    Sample keys:', Object.keys(data).slice(0, 8));
      const rows = data.rows || data.list || (Array.isArray(data) ? data : null);
      if (rows && rows.length > 0) {
        try {
          console.log('    rows[0]:', JSON.stringify(rows[0]).slice(0, 400));
        } catch (e) {
          console.log('    rows[0] (raw first):', rows[0]);
        }
      } else if (data.total !== undefined) {
        console.log('    total:', data.total, 'rows.length:', (data.rows || []).length);
      }
      return r;
    }
    if (r.status === 200 && r.json && Object.keys(r.json).length) {
      const d = r.json.data || r.json.result || r.json;
      const innerRows = d && (d.rows || d.list);
      if (innerRows && innerRows.length) {
        console.log('    (wrapped) sample:', JSON.stringify(innerRows[0]).slice(0, 350));
        return r;
      }
    }
  }
  return null;
}

async function exploreBasic() {
  await getInfo();
  await tryList(ACCOUNT_LIST_CANDIDATES, 'WS accounts / users');
  await tryList(PORT_CANDIDATES, 'ports');
  await tryList(CHAT_CANDIDATES, 'chat / newchat sessions');
}

async function probeChatNewchat() {
  console.log('\n=== Probing /chat/newchat related flows ===');
  // Common flows after loading the desk:
  // - list of WS accounts the user can serve (with unread, last msg)
  // - for a selected account: list of customer sessions / fans with history
  // - realtime: may be polling or separate WS

  const candidates = [
    '/biz/chat/list',
    '/chat/getSessionList',
    '/chat/getChatList',
    '/customerservice/getSessions',
    '/biz/customerservice/getAccountSessions',
    '/chat/accountSessions',
  ];
  await tryList(candidates, 'chat desk sessions');

  // Try fetching a "new" chat or recent convos
  console.log('\nTrying message history patterns...');
  // We would need a real sessionId or customer JID here.
  // For now just document common shapes.
}

// === MAIN ===
async function main() {
  loadSession();
  const cmd = process.argv[2] || 'help';

  if (cmd === 'help' || cmd === '--help') {
    console.log(`
Rocket RE script (mimics client against https://pn3.rocketgo.vip)

IMPORTANT: Real APIs live under /prod-api (axios baseURL in bundles).

Commands:
  captcha                                   Fetch captcha + uuid. Saves captcha-current.png
  login --user ZT011 --pass ss123123 --code ABCD --uuid <u-...>
                                            Perform login (use captcha step first)
  set-token <token>                         Manually inject token (from browser localStorage after login)
  set-cookie 'JSESSIONID=...; ...'          Manually inject cookie string
  getinfo                                   Call /prod-api/getInfo
  explore                                   Probe accounts, ports, chat sessions
  newchat                                   Full newchat desk simulation (accounts + friends + chat logs) - live on hf4cs
  newchat-chatlog <csUsername> <friend>     Fetch chat history for a conversation
  newchat-send <cs> <to> "text"             Send a text message (test)
  maintenance                               Maintenance endpoints (portInfo, socks, line, etc.)
  desk | newchat-data                       Targeted probes for CS desk data shapes
  call GET biz/account/list                 Arbitrary (uses /prod-api prefix unless full path)
  call POST /prod-api/xxx '{"foo":"bar"}'

After login in your *real browser* (recommended for first time):
  1. Login at https://pn3.rocketgo.vip
  2. Open DevTools > Application > Local Storage > look for "token" or "Admin-Token"
  3. Or Network tab > any XHR > copy "Authorization" or full "Cookie"
  4. Then: node src/scripts/re-rocket.js set-token eyJ...
`);
    return;
  }

  if (cmd === 'captcha') {
    const { uuid, path: imgPath } = await fetchCaptcha();
    console.log('\nNow open', imgPath || 'the captcha image in browser or describe the chars.');
    console.log('Then run:');
    console.log(`  node src/scripts/re-rocket.js login --user ZT011 --pass ss123123 --code THECODE --uuid ${uuid}`);
    return;
  }

  if (cmd === 'login') {
    const args = process.argv.slice(3);
    const getArg = (name) => {
      const i = args.indexOf('--' + name);
      return i >= 0 ? args[i+1] : null;
    };
    const username = getArg('user') || process.env.ROCKET_USER || 'ZT011';
    const password = getArg('pass') || process.env.ROCKET_PASS || 'ss123123';
    const code = getArg('code');
    const uuid = getArg('uuid');
    const kh = getArg('kh') || getArg('khUsername');

    if (!code || !uuid) {
      console.log('You need --code and --uuid (from previous captcha step).');
      console.log('Or run "captcha" first.');
      process.exit(1);
    }
    await doLogin({ username, password, code, uuid, khUsername: kh });
    return;
  }

  if (cmd === 'set-token') {
    const t = process.argv[3];
    if (!t) { console.log('Usage: set-token <token-string>'); return; }
    session.token = t;
    saveSession();
    console.log('Token saved. First 20 chars:', t.slice(0,20));
    return;
  }
  if (cmd === 'set-cookie') {
    const c = process.argv[3];
    if (!c) { console.log('Usage: set-cookie \'name=val; name2=val2\''); return; }
    session.cookies = c.split(';').map(s => s.trim());
    saveSession();
    console.log('Cookies saved. Will send on next calls.');
    return;
  }

  if (cmd === 'getinfo' || cmd === 'getInfo') {
    if (!session.token && !session.cookies.length) {
      console.log('No token/cookie. Login first or use set-token / set-cookie.');
      return;
    }
    await getInfo();
    return;
  }

  if (cmd === 'explore') {
    if (!session.token) {
      console.log('Login required first.');
      process.exit(1);
    }
    await exploreBasic();
    return;
  }

  if (cmd === 'chat' || cmd === 'newchat') {
    if (!session.token) { console.log('Login first'); return; }
    console.log('=== Real newchat / CS desk client simulation (hf4cs live) ===');

    await getInfo();

    console.log('\n--- 1. Load WA accounts this CSR can chat from (biz/chat/getAccountList) ---');
    const accR = await http('GET', 'biz/chat/getAccountList?pageNum=1&pageSize=10');
    const accRows = accR.json?.accountList?.rows || [];
    console.log('total accounts:', accR.json?.accountList?.total || accRows.length);
    if (accRows[0]) {
      console.log('sample account:', JSON.stringify(accRows[0], null, 2).slice(0, 600));
      // save first for later use
      globalThis.__firstCsUsername = accRows[0].username;
    }

    const cs = globalThis.__firstCsUsername || '4473515622158175';

    console.log(`\n--- 2. Load friends/customers for first account (csUsername=${cs}) ---`);
    const frR = await http('GET', `biz/friends/list?csUsername=${cs}&pageNum=1&pageSize=5`);
    console.log('total friends for this cs:', frR.json?.total);
    if (frR.json?.rows?.[0]) {
      console.log('sample friend:', JSON.stringify(frR.json.rows[0]).slice(0, 450));
      globalThis.__firstFriend = frR.json.rows[0].username;
    }

    const friend = globalThis.__firstFriend || '963937411490';

    console.log(`\n--- 3. Load chat history (chatLogList for ${cs} <-> ${friend}) ---`);
    const logR = await http('GET', `biz/chat/chatLogList?csUsername=${cs}&username=${friend}&pageNum=1&pageSize=5`);
    if (logR.json?.rows) {
      console.log('total logs:', logR.json.total);
      console.log('sample message:', JSON.stringify(logR.json.rows[0]).slice(0, 500));
    } else {
      console.log(logR.json);
    }

    console.log('\n--- 4. Other desk primitives ---');
    const notRead = await http('GET', `biz/chat/getNotRead?csUsername=${cs}`);
    console.log('notRead:', notRead.json);

    console.log('\n=== Simulation done. Use:');
    console.log('  node ... newchat-chatlog <csUsername> <friendUsername>');
    console.log('  node ... newchat-send <cs> <to> "text"');
    return;
  }

  if (cmd === 'newchat-chatlog') {
    const cs = process.argv[3];
    const to = process.argv[4];
    if (!cs || !to) { console.log('Usage: newchat-chatlog <csUsername> <friendUsername>'); return; }
    const r = await http('GET', `biz/chat/chatLogList?csUsername=${cs}&username=${to}&pageNum=1&pageSize=10`);
    console.log(JSON.stringify(r.json, null, 2));
    return;
  }

  if (cmd === 'newchat-send') {
    const cs = process.argv[3];
    const to = process.argv[4];
    const text = process.argv.slice(5).join(' ');
    if (!cs || !to || !text) { console.log('Usage: newchat-send <csUsername> <toUsername> "message text"'); return; }
    // Common shape from bundle analysis (data payload)
    const payload = {
      csUsername: cs,
      username: to,
      chatContent: text,
      chatType: 0,   // 0=text ?
      msgType: 0,
      // other fields like sourceContent, quoted etc. can be added
    };
    const r = await http('POST', 'biz/chat/sendMsg', payload);
    console.log('sendMsg response:', r.json || r.text);
    return;
  }

  if (cmd === 'maintenance') {
    if (!session.token) { console.log('Login first'); return; }
    console.log('=== Maintenance / system info (ports, proxies, settings) ===');
    for (const p of ['biz/maintenance/getPortInfo', 'biz/maintenance/getSocksInfo', 'biz/main/getLine', 'biz/maintenance/getCollectBlockSession']) {
      const r = await http('GET', p);
      console.log(p, '->', r.status, r.json);
    }
    return;
  }

  if (cmd === 'desk' || cmd === 'newchat-data') {
    if (!session.token) { console.log('Login first'); return; }
    const acctId = process.argv[3] || null;  // optional account id for targeted load e.g. node ... desk 12345
    console.log('=== Probing newchat / CS desk data shapes (using csr permissions) ===');
    console.log('Tip: pass an accountId if you have one from browser or other call: node ... desk <id>');
    const candidates = [
      'biz/friends/list',
      'biz/chat/list',
      'biz/customerservice/getAccountSessions',
      'biz/account/list',
      'biz/pool/list',
      'biz/task/list',
      'biz/groupchattask/list',
      'biz/chat/getSessionList',
      'biz/friends/list?pageNum=1&pageSize=50&status=0'
    ];
    for (const p of candidates) {
      let url = p;
      if (acctId && p.includes('getAccountSessions')) {
        url = `${p}/${acctId}`;
      }
      const r = await http('GET', url);
      const summary = r.json && r.json.rows ? `total=${r.json.total} rows=${r.json.rows.length}` : (r.json ? Object.keys(r.json).slice(0,4).join(',') : r.status);
      console.log(url, '->', r.status, summary);
      if (r.json && (r.json.rows || r.json.data) && (r.json.rows?.[0] || r.json.data?.[0])) {
        const sample = r.json.rows?.[0] || r.json.data?.[0];
        console.log('  sample:', JSON.stringify(sample).slice(0, 300));
      } else if (r.json && r.json.msg) {
        console.log('  ', r.json.msg);
      }
    }
    if (acctId) {
      console.log('\nAlso trying friends for account:', acctId);
      const fr = await http('GET', `biz/friends/list?accountId=${acctId}`);
      console.log('friends for acct ->', fr.status, fr.json);
    }
    return;
  }

  if (cmd === 'call') {
    const method = (process.argv[3] || 'GET').toUpperCase();
    let url = process.argv[4];
    let body = null;
    if (process.argv[5]) {
      try { body = JSON.parse(process.argv[5]); } catch { body = process.argv[5]; }
    }
    if (!url) { console.log('Usage: call GET biz/account/list   or call POST /prod-api/xxx \'{"a":1}\''); return; }
    // If user passed full /prod-api already, http() will use it; otherwise it adds it.
    const r = await http(method, url, body);
    console.log(`[${r.status}]`, JSON.stringify(r.json || r.text?.slice(0, 600), null, 2));
    return;
  }

  // default: show current session info + quick help
  console.log('Current session token present?', !!session.token);
  console.log('Cookies captured:', session.cookies?.length || 0);
  console.log('Run with "help" for commands.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
