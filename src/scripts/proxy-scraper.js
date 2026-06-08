#!/usr/bin/env node

/**
 * Proxy Scraper for WA Control
 * Pulls free proxies from public GitHub lists for testing purposes.
 * 
 * Usage:
 *   node src/scripts/proxy-scraper.js --type socks5 --limit 100 --test
 *   node src/scripts/proxy-scraper.js --type http --limit 50
 *   node src/scripts/proxy-scraper.js --dry-run
 *
 * WARNING: Free proxies are low quality and often blocked.
 * Only use for testing the proxy injection / health checker / UI flows.
 * Never use with real WhatsApp accounts for production.
 */

import fetch from 'node:fetch'; // Node 18+ has global fetch, but explicit for clarity
import ProxyService from '../core/proxies/ProxyService.js';
import db from '../db/connection.js';
import { logger } from '../utils/logger.js';

const DEFAULT_SOURCES = {
  socks5: [
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt',
  ],
  http: [
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
    'https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt',
  ],
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: 'socks5',
    limit: 100,
    test: false,
    dryRun: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') options.help = true;
    if (arg === '--test') options.test = true;
    if (arg === '--dry-run') options.dryRun = true;
    if (arg.startsWith('--type=')) options.type = arg.split('=')[1];
    if (arg.startsWith('--limit=')) options.limit = parseInt(arg.split('=')[1], 10);
  }

  if (!['http', 'socks5'].includes(options.type)) {
    options.type = 'socks5';
  }

  return options;
}

function printHelp() {
  console.log(`
Proxy Scraper for WA Control

Options:
  --type=socks5|http     Proxy type to scrape (default: socks5)
  --limit=100            Max number of proxies to add (default: 100)
  --test                 Test each proxy after adding using the existing health checker
  --dry-run              Fetch and parse but do not add to database
  --help, -h             Show this help

Examples:
  node src/scripts/proxy-scraper.js --type socks5 --limit 50
  node src/scripts/proxy-scraper.js --type http --test --limit 20
  `);
}

async function fetchProxyList(url) {
  try {
    const res = await fetch(url, { timeout: 15000 });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);
  } catch (err) {
    logger.warn(`Failed to fetch ${url}: ${err.message}`);
    return [];
  }
}

function parseProxyLine(line, type) {
  // Common formats:
  // 1.2.3.4:8080
  // 1.2.3.4:8080:user:pass
  const parts = line.split(':');
  if (parts.length < 2) return null;

  const host = parts[0];
  const port = parseInt(parts[1], 10);

  if (!host || !port || port < 1 || port > 65535) return null;

  const proxy = {
    host,
    port,
    type,
    username: parts[2] || null,
    password: parts[3] || null,
  };

  return proxy;
}

async function scrapeProxies(type = 'socks5', limit = 100) {
  const sources = DEFAULT_SOURCES[type] || DEFAULT_SOURCES.socks5;
  const allProxies = [];

  console.log(`Scraping ${type.toUpperCase()} proxies from ${sources.length} GitHub sources...`);

  for (const url of sources) {
    const lines = await fetchProxyList(url);
    for (const line of lines) {
      const proxy = parseProxyLine(line, type);
      if (proxy) {
        allProxies.push(proxy);
      }
    }
  }

  // Deduplicate by host:port
  const seen = new Set();
  const uniqueProxies = allProxies.filter(p => {
    const key = `${p.host}:${p.port}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Shuffle and limit
  const shuffled = uniqueProxies.sort(() => Math.random() - 0.5);
  const limited = shuffled.slice(0, limit);

  console.log(`Found ${uniqueProxies.length} unique proxies. Using ${limited.length}.`);
  return limited;
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log(`\n=== WA Control Proxy Scraper ===`);
  console.log(`Type: ${options.type}`);
  console.log(`Limit: ${options.limit}`);
  console.log(`Test after add: ${options.test}`);
  console.log(`Dry run: ${options.dryRun}\n`);

  const proxies = await scrapeProxies(options.type, options.limit);

  if (proxies.length === 0) {
    console.log('No valid proxies found. Exiting.');
    process.exit(0);
  }

  if (options.dryRun) {
    console.log('Dry run enabled. First 5 proxies that would be added:');
    proxies.slice(0, 5).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.host}:${p.port}`);
    });
    process.exit(0);
  }

  const proxyService = new ProxyService(db);

  let added = 0;
  let tested = 0;
  let good = 0;

  for (const p of proxies) {
    try {
      const name = `github-${options.type}-${p.host.replace(/\./g, '-')}`;

      const created = await proxyService.createProxy({
        name,
        type: p.type,
        host: p.host,
        port: p.port,
        username: p.username,
        password: p.password,
        region: 'scraped',
      });

      added++;

      if (options.test) {
        console.log(`Testing ${p.host}:${p.port}...`);
        const result = await proxyService.testProxy(created);
        tested++;

        if (result.ok) {
          good++;
          console.log(`  ✓ OK (${result.latencyMs}ms)`);
        } else {
          console.log(`  ✗ Failed: ${result.error || result.status || 'unknown'}`);
        }
      }
    } catch (err) {
      // Likely duplicate or DB error
      if (!err.message.includes('duplicate') && !err.message.includes('unique')) {
        logger.warn(`Failed to add proxy ${p.host}:${p.port}: ${err.message}`);
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Proxies processed: ${proxies.length}`);
  console.log(`Successfully added: ${added}`);
  if (options.test) {
    console.log(`Tested: ${tested}`);
    console.log(`Working: ${good}`);
  }

  console.log(`\nYou can now manage these proxies in the UI or via API.`);
  console.log(`Tip: Use the health check feature to periodically clean dead ones.\n`);
}

main().catch(err => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
