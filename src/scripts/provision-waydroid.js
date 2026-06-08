#!/usr/bin/env node

/**
 * CLI helper to provision a Waydroid instance for a ws_account
 * and trigger the phone-less linking flow.
 *
 * Usage:
 *   node src/scripts/provision-waydroid.js --account <ws_account_id>
 *   node src/scripts/provision-waydroid.js --account <id> --host my-vps.example.com
 */

import EmulatorService from '../cloud/emulator.service.js';
import db from '../db/connection.js';

const args = process.argv.slice(2);
const accountIdx = args.indexOf('--account');
const hostIdx = args.indexOf('--host');

if (accountIdx === -1) {
  console.error('Usage: node src/scripts/provision-waydroid.js --account <ws_account_id> [--host <hostname>]');
  process.exit(1);
}

const wsAccountId = args[accountIdx + 1];
const host = hostIdx > -1 ? args[hostIdx + 1] : 'localhost';

async function main() {
  const service = new EmulatorService();

  console.log(`Provisioning Waydroid for account ${wsAccountId} on host ${host}...`);

  try {
    const result = await service.provisionAndLink(wsAccountId, { host });

    console.log('\n=== Provisioning Result ===');
    console.log('Emulator ID:', result.emulator.id);
    console.log('Status:', result.emulator.status);
    console.log('\nPairing Code (enter this inside the Waydroid WhatsApp app):');
    console.log(result.linkResult.pairingCode);
    console.log('\n' + result.linkResult.instructions);
    console.log('\nAfter entering the code, run:');
    console.log(`  node src/scripts/provision-waydroid.js --shutdown ${result.emulator.id}`);
  } catch (err) {
    console.error('Provisioning failed:', err.message);
    process.exit(1);
  }
}

main();
