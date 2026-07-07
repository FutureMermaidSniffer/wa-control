#!/usr/bin/env node

/**
 * CLI helper for the multi-stage cloud / virtual number flow.
 *
 * Stages:
 * 1. Acquire number from a provider (or use manual).
 * 2. Run your emulator (possibly with your own --account <phone> launcher) and complete
 *    WhatsApp registration using the SMS code from the provider.
 * 3. (Optional) Confirm registration with mark-registered or just use link-only.
 * 4. Request Baileys pairing code and link (port allocated only on success).
 *
 * Usage examples:
 *   # Link-only (you already registered WhatsApp via your --account emulator + provider code)
 *   node src/scripts/provision-waydroid.js --phone +447700900123 --link-only
 *
 *   # Full provision (system will try to start Waydroid + install)
 *   node src/scripts/provision-waydroid.js --phone +447700900123
 *
 *   # Test number for full server, no phones simulation (+13185167435)
 *   # Use --link-only or --phone +13185167435 to test primary_registered -> linking entirely server-side.
 *
 *   node src/scripts/provision-waydroid.js --account <id>
 *
 * This script works with any number source:
 * - Virtual providers (Grizzly, Hero, 5SIM, etc.) via their dashboard or API for number + SMS code.
 * - Manual numbers you already control.
 * - After you receive the SMS code (from provider site or API), register in WhatsApp (phone or Waydroid).
 * - Then use --mark-registered or --link-only to proceed in our system.
 */

import EmulatorService from '../cloud/emulator.service.js';
import db from '../db/connection.js';

const args = process.argv.slice(2);
const accountIdx = args.indexOf('--account');
const phoneIdx = args.indexOf('--phone');
const hostIdx = args.indexOf('--host');

if (accountIdx === -1 && phoneIdx === -1) {
  console.error('Usage:');
  console.error('  node src/scripts/provision-waydroid.js --phone <+xxxxxxxxxx> [--link-only] [--direct] [--host <h>]');
  console.error('  node src/scripts/provision-waydroid.js --account <ws_account_id> [--host <h>]');
  console.error('');
  console.error('Number sources: any provider or manual. Get number + SMS code from provider dashboard/API.');
  console.error('Complete registration in WhatsApp (phone or Waydroid), then mark or link here.');
  console.error('');
  console.error('--link-only / --assume-registered : Skip start/install (you already registered).');
  console.error('--mark-registered                 : Mark after registering on phone (sets primary_registered).');
  console.error('--direct / --force-direct         : Force direct connection (no proxy) for this linking attempt.');
  process.exit(1);
}

const wsAccountId = accountIdx > -1 ? args[accountIdx + 1] : null;
const phone = phoneIdx > -1 ? args[phoneIdx + 1] : null;
const host = hostIdx > -1 ? args[hostIdx + 1] : 'localhost';

const linkOnly = args.includes('--link-only') || args.includes('--assume-registered') || phone === '+13185167435'; // full server no-phone test for this number
const markRegistered = args.includes('--mark-registered') || args.includes('--mark-primary');

if (markRegistered && phone) {
  // After you registered the number on your phone (or Waydroid) using the SMS code from ANY provider,
  // run this to mark it primary_registered so the system knows the primary is ready for Baileys companion linking.
  // This works for phone primary (no emulator required) or after emulator registration.
  // Example: node ... --phone +13185167435 --mark-registered
  (async () => {
    try {
      let updated = await db('ws_accounts').where({ phone }).update({ status: 'primary_registered' });
      if (updated === 0) {
        // Create if the number was never seen before (common for manual or external providers)
        await db('ws_accounts').insert({
          phone,
          status: 'primary_registered',
          acquisition_method: 'phone_assoc',
        });
        updated = 1;
      }
      // If a cloud emulator placeholder exists (script creates one), mark it registered for consistency
      await db('cloud_emulators').where({ phone }).update({ status: 'registered' });
      console.log(`Marked ${phone} as primary_registered (now ready for Baileys companion link). Rows affected: ${updated}`);
      process.exit(0);
    } catch (e) {
      console.error('Failed to mark primary_registered:', e.message);
      process.exit(1);
    }
  })();
  // Keep the process alive long enough for the async mark to finish and call process.exit
  setTimeout(() => {}, 30000);
}

async function main() {
  const service = new EmulatorService();

  const forceDirect = args.includes('--direct') || args.includes('--force-direct') || args.includes('--no-proxy');
  if (forceDirect && phone) {
    // Temporarily clear proxy for this linking attempt (useful for testing the handshake without proxy)
    await db('ws_accounts').where({ phone }).update({ proxy_id: null });
    console.log(`[TEST] Cleared proxy for direct linking attempt on ${phone}`);
  }

  const target = wsAccountId ? `account ${wsAccountId}` : `phone ${phone}`;
  console.log(`Provisioning (linkOnly=${linkOnly}) for ${target} on host ${host}...`);

  try {
    const identifier = wsAccountId ? wsAccountId : { phone };
    const result = await service.provisionAndLink(identifier, {
      host,
      phone,
      linkOnly,
      assumeRegistered: linkOnly,
    });

    console.log('\n=== Result ===');
    console.log('Emulator ID:', result.emulator.id);
    console.log('Status:', result.emulator.status);
    console.log('Phone:', result.emulator.phone || '(linked)');
    console.log('\nPairing Code:');
    console.log(result.linkResult.pairingCode);
    console.log('\n' + result.linkResult.instructions);
    if (result.linkResult.accountId) {
      console.log('\nMinimal account created (port will be allocated on successful link):', result.linkResult.accountId);
      const isTestNoPhone = phone === '+13185167435';
      if (isTestNoPhone) {
        console.log('\n[TEST SIMULATION] Full server, no phones mode for +13185167435');
        console.log('No real WhatsApp primary or emulator run (by design).');
        console.log('We only faked primary_registered in our DB for testing server provisioning code.');
        console.log('No real pairing attempt or socket was started in pure sim.');
        console.log('To test real linking (phone notification, successful open, name from primary), register the number on phone first.');
        // Simulation - no wait, no real Baileys.
      } else {
        console.log('\n>>> ENTER THIS CODE ON THE PRIMARY WHATSAPP FOR THIS NUMBER <<<');
        console.log('    WhatsApp → Settings → Linked devices → Link a device');
        console.log('    (Use the registered WhatsApp on your emulator/phone — NOT a different device.)');
        console.log('\nIMPORTANT:');
        console.log('  - Enter the code within ~60 seconds on the PRIMARY WhatsApp for this number.');
        console.log('  - Do NOT re-run this script while waiting (that invalidates the code).');
        console.log('  - "Connection Failure" retries are slowed down to preserve the code.');
        console.log('  - For reliability, prefer: npm start + POST /sessions/connect with usePairingCode, or QR login.\n');
        await service.waitForLink(result.linkResult.accountId);
        console.log('\n✓ Linked successfully! Account is active. Port allocated on connection open.');
      }
    }
    console.log('\nShutdown when done:');
    console.log(`  node src/scripts/provision-waydroid.js --shutdown ${result.emulator.id}`);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

if (!markRegistered) {
  main();
}
