#!/usr/bin/env node
/**
 * MoreLogin FAST registration script (target: < 3 min to "waiting for code").
 *
 * Supplier window for number + SMS code is ~10 minutes.
 * → Call this the instant you receive the number from the provider.
 * → It will get a (warm) cloud phone, launch WhatsApp, and type the number in.
 * → Then poll supplier for code and submit it (or re-run with --code).
 *
 * Examples:
 *   node src/scripts/provision-morelogin.js --phone +18103831775
 *   node ... --phone +18103831775 --code 123456 --link --power-off
 */

import MoreLoginService from '../cloud/morelogin.service.js';
import db from '../db/connection.js';

const args = process.argv.slice(2);
const phone = (args.find(a => a.startsWith('--phone')) || '').split('=')[1] || args[args.indexOf('--phone') + 1];
const code = (args.find(a => a.startsWith('--code')) || '').split('=')[1] || args[args.indexOf('--code') + 1];
const doLink = args.includes('--link') || args.includes('--pair');
const doPowerOff = args.includes('--power-off') || args.includes('--off');

const enterPhoneOnly = !code;
if (!phone) {
  console.error('Usage:');
console.error('  node src/scripts/provision-morelogin.js --phone +xxxxxxxx                 # fast: start WA + enter number (use when you just got the number)');
console.error('  node src/scripts/provision-morelogin.js --phone +xxxxxxxx --code 123456   # full (enter code too)');
console.error('  ... [--link] [--power-off]');
  process.exit(1);
}

const svc = new MoreLoginService();

(async () => {
  console.log('=== MoreLogin FAST separate registration ===');
  console.log('Phone:', phone, 'Code provided:', !!code);
  console.log('Goal: get WhatsApp running + number entered within supplier time window.');

  const reg = await svc.registerNumberOnCloud({ phone, code, enterPhoneOnly });
  console.log('Registration result:', reg);

  if (enterPhoneOnly) {
    console.log('\n>>> Phone number entered. WA should now be waiting for SMS code from supplier.');
    console.log('    Get the code quickly and re-run with --code or use the /cloud/morelogin/action endpoint.');
  }

  if (doLink) {
    console.log('\nRequesting Baileys pairing code (primary should now be registered on cloud phone)...');
    const link = await svc.linkWithPairingCode(reg.emulator.id);
    console.log('PAIRING CODE:', link.pairingCode);
    console.log(link.instructions);

    if (doPowerOff) {
      console.log('\nPowering off cloud phone to stop billing...');
      await svc.powerOff(reg.moreloginId || reg.emulator.morelogin_id).catch(console.warn);
      console.log('Powered off.');
    }
  } else {
    console.log('\nNext steps:');
    console.log('  - Verify registration succeeded inside WhatsApp on the cloud phone.');
    console.log('  - Then: node ... (same) --link   or call POST /cloud/morelogin/:emulatorId/link');
    console.log('  - After link success: power off the cloud phone.');
  }

  process.exit(0);
})().catch(e => {
  console.error('FAILED:', e.message);
  process.exit(1);
});
