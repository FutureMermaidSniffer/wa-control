#!/usr/bin/env node
/**
 * Live test script for MoreLogin integration (step-by-step, safe by default).
 *
 * Usage (safe read-only first):
 *   node src/scripts/test-morelogin-client.js --action list
 *   node src/scripts/test-morelogin-client.js --action=info --id 1711663173256058
 *   node src/scripts/test-morelogin-client.js --action=find-whatsapp
 *
 * Common flow to start WhatsApp on an existing cloud phone:
 * Reliable start (from MoreLogin docs):
 *   - Use powerOn (include proxyId if the device/account uses proxies).
 *   - Poll /info until envStatus === 4.
 *   - Handle starting (3), stopped (2), errors (e.g. no proxy, balance).
 *   - Our ensureStarted does exactly this + retries + logging.
 *
 *   node src/scripts/test-morelogin-client.js --action=power-on --id 1711696639593642 --proxy-id 1711665648089575 --confirm
 *   # or use --action fast-enter-phone for full quick reg flow
 *
 *   # 2. Install WhatsApp (uses catalog discovery)
 *   node src/scripts/test-morelogin-client.js --action=install-wa --id 1711663173256058 --confirm
 *
 *   # 3. Start WhatsApp
 *   node src/scripts/test-morelogin-client.js --action=start-wa --id 1711663173256058 --confirm
 *
 *   # Alternative generic control (after it's running)
 *   node ... --action=exe --id 1711663173256058 --cmd "am start -n com.whatsapp/.Main" --confirm
 *
 * Mutating actions require --confirm. Both --action=foo and --action foo styles work.
 *
 * Always starts with list / token check. Never auto-creates without --confirm.
 */

import MoreLoginClient from '../cloud/morelogin.client.js';
import { logger } from '../utils/logger.js';

const args = process.argv.slice(2);

// Robust flag parsing: supports both "--action foo" and "--action=foo"
function getFlag(name) {
  // exact match next arg style: --name value
  const idx = args.indexOf(name);
  if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith('--')) {
    return args[idx + 1];
  }
  // equals style: --name=value
  const eq = args.find(a => a.startsWith(name + '='));
  if (eq) return eq.split('=')[1];
  return null;
}

const action = getFlag('--action') || 'list';
const targetId = getFlag('--id');
const phone = getFlag('--phone');
const code = getFlag('--code');
const cmdFlag = getFlag('--cmd'); // for --action exe

const confirm = args.includes('--confirm') || args.includes('--live');

const client = new MoreLoginClient();

async function main() {
  console.log('=== MoreLogin Client Test ===');
  console.log('Mode:', client.mode, 'Host:', client.host);
  console.log('Confirm/mutating allowed:', confirm);
  console.log('');

  if (action === 'token' || action === 'auth') {
    const token = await client.getToken();
    console.log('Token (truncated):', token ? token.slice(0, 20) + '...' : '(local or empty)');
    return;
  }

  if (action === 'list' || action === 'devices') {
    console.log('Listing devices...');
    const res = await client.listDevices(1, 20);
    const list = res.data?.dataList || res.data || [];
    if (Array.isArray(list)) {
      list.forEach((d, i) => {
        console.log(`${i+1}. ID=${d.id}  name=${d.envName || d.name}  envStatus=${d.envStatus}  sku=${d.skuId}`);
      });
      if (list[0]) console.log('\nUse this ID with --id :', list[0].id);
    } else {
      console.dir(res, { depth: 2 });
    }
    return;
  }

  if (action === 'info') {
    if (!targetId) {
      console.error('Need --id <cloudPhoneId>');
      process.exit(1);
    }
    const info = await client.getDeviceInfo(targetId);
    console.dir(info, { depth: 3 });
    return;
  }

  if (action === 'find-whatsapp' || action === 'wa-app') {
    console.log('Searching MoreLogin app library for WhatsApp...');
    const wa = await client.findWhatsAppApp();
    console.log('WhatsApp candidate:', wa);
    if (!wa) {
      console.log('No match. Trying broad list...');
      const all = await client.listApps(1, 20);
      console.dir(all, { depth: 1 });
    }
    return;
  }

  if (action === 'create') {
    if (!confirm) {
      console.log('DRY RUN. Add --confirm to actually create a cloud phone.');
      console.log('Would create with skuId=', process.env.MORELOGIN_DEFAULT_SKU_ID || '10004');
      return;
    }
    console.log('CREATING cloud phone (this costs money/time)...');
    const created = await client.createPhone({
      skuId: process.env.MORELOGIN_DEFAULT_SKU_ID || '10004',
      quantity: 1,
      envRemark: 'wa-control test registration phone ' + new Date().toISOString(),
    });
    console.dir(created, { depth: 2 });
    const newId = created?.data?.[0] || created?.data;
    if (newId) {
      console.log('Created id:', newId);
      console.log('Now waiting for ready (up to 5min)...');
      try {
        await client.waitUntilReady(newId, { timeoutSeconds: 300 });
        console.log('Ready!');
      } catch (e) {
        console.error('Wait failed:', e.message);
      }
    }
    return;
  }

  if (action === 'power-on') {
    if (!targetId) throw new Error('--id required');
    const proxyId = args.includes('--proxy-id') ? args[args.indexOf('--proxy-id') + 1] : null;
    if (!confirm) {
      console.log('DRY. Would powerOn', targetId, proxyId ? `with proxy ${proxyId}` : '');
      return;
    }
    // Use service for robust start (handles proxy, poll, errors)
    const { MoreLoginService } = await import('../cloud/morelogin.service.js');
    const svc = new MoreLoginService();
    const res = await svc.ensureStarted(targetId, { proxyId, maxWaitSec: 180 });
    console.log("Start result:", res);
    return;
  }

  if (action === 'power-off') {
    if (!targetId) throw new Error('--id required');
    if (!confirm) {
      console.log('DRY. Would powerOff', targetId);
      return;
    }
    const r = await client.powerOff(targetId);
    console.dir(r);
    return;
  }

  if (action === 'install-wa') {
    if (!targetId) throw new Error('--id required');
    if (!confirm) {
      console.log('DRY. Would discover WA + install on', targetId);
      return;
    }
    const wa = await client.findWhatsAppApp();
    if (!wa || !wa.versionCode) throw new Error('Could not find usable WhatsApp version in catalog');
    console.log('Installing', wa);
    const r = await client.installApp(targetId, wa.packageName, wa.versionCode);
    console.dir(r);
    return;
  }

  if (action === 'start-wa') {
    if (!targetId) throw new Error('--id required');
    const pkg = 'com.whatsapp';
    if (!confirm) {
      console.log('DRY. Would start', pkg, 'on', targetId);
      return;
    }
    const r = await client.startApp(targetId, pkg);
    console.dir(r);
    return;
  }

  if (action === 'enter-phone' || action === 'fast-enter-phone') {
    if (!phone) throw new Error('--phone required (optionally --id to target a specific device)');
    console.log('FAST enter phone', phone);
    const { MoreLoginService } = await import('../cloud/morelogin.service.js');
    const svc = new MoreLoginService();
    const res = await svc.registerNumberOnCloud({ phone, enterPhoneOnly: true });
    console.dir(res);
    console.log('WA should now be at the "enter code" screen. Get SMS code from supplier and input it.');
    return;
  }

  if (action === 'exe') {
    if (!targetId) throw new Error('--id required');
    const cmd = cmdFlag || 'pm list packages';
    const r = await client.exeCommand(targetId, cmd);
    console.dir(r);
    return;
  }

  if (action === 'screenshot') {
    if (!targetId) throw new Error('--id required');
    const r = await client.screenshotBase64(targetId);
    console.log('Screenshot base64 length:', r?.data?.length || 'no data');
    // In real use write to file
    return;
  }

  if (action === 'full-test-reg') {
    // Full end-to-end-ish test for registration sequence (requires real number + code)
    if (!phone || !code) {
      console.error('Usage: --action=full-test-reg --phone +1xxxxxxxxxx --code 123456 [--confirm]');
      process.exit(1);
    }
    if (!confirm) {
      console.log('DRY RUN full reg flow for', phone, 'code=', code);
      console.log('Steps would be: create → power → wait → find+install WA → start WA → (input phone+code via exe/touch) → verify');
      return;
    }

    console.log('=== LIVE FULL REG TEST (costs $) ===');
    const sku = process.env.MORELOGIN_DEFAULT_SKU_ID || '10004';
    const createRes = await client.createPhone({ skuId: sku, quantity: 1, envRemark: `reg-test-${phone}` });
    const mlId = Array.isArray(createRes.data) ? createRes.data[0] : createRes.data;
    console.log('Created:', mlId);

    await client.waitUntilReady(mlId, { timeoutSeconds: 300 });
    console.log('Device ready');

    const wa = await client.findWhatsAppApp();
    if (wa?.versionCode) {
      await client.installApp(mlId, wa.packageName, wa.versionCode);
      console.log('WA installed');
    }
    await client.startApp(mlId, wa?.packageName || 'com.whatsapp');

    // At this point: manual or scripted entry of phone+code inside WA on the cloud phone.
    // Here we just demonstrate exe + touch hooks + screenshot.
    console.log('Phone + code should now be entered inside WhatsApp on the device.');
    console.log('Example: use --action=exe --id', mlId, '--cmd "input text ' + phone + '" (after tapping phone field)');

    const shot = await client.screenshotBase64(mlId).catch(() => null);
    console.log('Current screen captured (base64 len):', shot?.data?.length || 0);

    // Example exe for input (fragile, depends on current focus)
    // await client.exeCommand(mlId, `input text ${phone.replace('+','')}`);

    console.log('After successful WA registration on device, call mark-registered + link in wa-control.');
    console.log('Then POWER OFF this device to avoid billing:');
    console.log('  node ... --action=power-off --id', mlId, '--confirm');

    // Leave powered on for the test - user will power off.
    return;
  }

  console.log('Unknown action. Supported: list, info, find-whatsapp, create, power-on, power-off, install-wa, start-wa, enter-phone, exe, screenshot, full-test-reg');
  console.log('FAST path example: --action enter-phone --id XXX --phone +18103831775 --confirm');
}

main().catch((e) => {
  console.error('TEST FAILED:', e.message);
  if (e.code) console.error('API code:', e.code);
  process.exit(1);
});
