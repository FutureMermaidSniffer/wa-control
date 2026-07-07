#!/usr/bin/env node
/**
 * Test MoreLoginService high level methods (DB + live client where safe).
 *
 * Safe:
 *   node src/scripts/test-morelogin-service.js --action=list
 *   node src/scripts/test-morelogin-service.js --action=discover-wa
 *
 * With existing device (read):
 *   node ... --action=info --id 1711663173256058
 *
 * Full live reg test (costs money + uses a real number you control):
 *   node ... --action=register --phone +1... --code 123456 --confirm
 */

import MoreLoginService from '../cloud/morelogin.service.js';
import db from '../db/connection.js';

const args = process.argv.slice(2);
const action = (args.find(a => a.startsWith('--action=')) || '--action=list').split('=')[1];
const id = (args.find(a => a.startsWith('--id=')) || '').split('=')[1];
const phone = (args.find(a => a.startsWith('--phone=')) || '').split('=')[1];
const code = (args.find(a => a.startsWith('--code=')) || '').split('=')[1];
const confirm = args.includes('--confirm');

const svc = new MoreLoginService();

async function main() {
  console.log('MoreLoginService test. Action=', action, 'confirm=', confirm);

  if (action === 'list') {
    const rows = await db('cloud_emulators').where({ provider: 'morelogin' }).orWhere({ provider: 'morelogin' }).limit(20);
    console.log('Recent morelogin emulator records:', rows.length);
    rows.forEach(r => console.log(r.id, r.phone, r.morelogin_id, r.status));
    return;
  }

  if (action === 'discover-wa') {
    const wa = await svc.client.findWhatsAppApp();
    console.log('WA catalog:', wa);
    return;
  }

  if (action === 'info') {
    if (!id) throw new Error('need --id=<morelogin numeric or emulator uuid>');
    const emu = await svc.getEmulator(id);
    console.dir(emu, { depth: 1 });
    if (emu?.morelogin_id) {
      const live = await svc.client.getDeviceInfo(emu.morelogin_id);
      console.log('Live ML status:', live?.data?.envStatus);
    }
    return;
  }

  if (action === 'register') {
    if (!phone || !code) throw new Error('--phone=... --code=... required');
    if (!confirm) {
      console.log('DRY: would do full registerNumberOnCloud for', phone);
      return;
    }
    const result = await svc.registerNumberOnCloud({ phone, code });
    console.dir(result, { depth: 2 });
    console.log('\nAfter you verify registration completed in the WA on cloud phone, run:');
    console.log('  mark via API or node script, then link.');
    return;
  }

  console.log('Actions: list | discover-wa | info | register');
}

main().catch(e => { console.error(e); process.exit(1); });
