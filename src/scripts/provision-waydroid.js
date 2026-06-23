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
 *   node src/scripts/provision-waydroid.js --account <id>
 */

import EmulatorService from '../cloud/emulator.service.js';

const args = process.argv.slice(2);
const accountIdx = args.indexOf('--account');
const phoneIdx = args.indexOf('--phone');
const hostIdx = args.indexOf('--host');
const linkOnly = args.includes('--link-only') || args.includes('--assume-registered');

if (accountIdx === -1 && phoneIdx === -1) {
  console.error('Usage:');
  console.error('  node src/scripts/provision-waydroid.js --phone <+4477...> [--link-only] [--host <h>]');
  console.error('  node src/scripts/provision-waydroid.js --account <ws_account_id> [--host <h>]');
  console.error('');
  console.error('--link-only / --assume-registered : Skip emulator start/install (use when you ran registration');
  console.error('                                    yourself with --account <phone> + provider SMS code).');
  process.exit(1);
}

const wsAccountId = accountIdx > -1 ? args[accountIdx + 1] : null;
const phone = phoneIdx > -1 ? args[phoneIdx + 1] : null;
const host = hostIdx > -1 ? args[hostIdx + 1] : 'localhost';

async function main() {
  const service = new EmulatorService();

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
    console.log('\nShutdown when done:');
    console.log(`  node src/scripts/provision-waydroid.js --shutdown ${result.emulator.id}`);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

main();
