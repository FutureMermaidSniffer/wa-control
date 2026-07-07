#!/usr/bin/env node
/**
 * Automate removal of non-usable contacts.
 * 
 * Non-usable = dnd or !opted_in, or you can extend with other criteria
 * (e.g. last failed interaction, invalid format, from banned accounts, etc.)
 *
 * Usage:
 *   node src/scripts/clean-non-usable-contacts.js --account <ws_account_id> --dry
 *   node src/scripts/clean-non-usable-contacts.js --all --confirm
 */

import db from "../db/connection.js";
import contactsData from "../data/contacts.data.js";

const args = process.argv.slice(2);
const accountIdx = args.indexOf("--account");
const all = args.includes("--all");
const confirm = args.includes("--confirm");
const dry = args.includes("--dry") || !confirm;

const wsAccountId = accountIdx > -1 ? args[accountIdx + 1] : null;

(async () => {
  console.log("Cleaning non-usable contacts (dnd or !opted_in)...");
  const result = await contactsData.cleanNonUsableContacts({
    assigned_ws_account_id: wsAccountId,
    dryRun: dry,
  });
  console.dir(result);

  // Bonus: if cleaning all or specific, also clean contacts belonging to non-usable ws_accounts (error/banned/offline long)
  if (!wsAccountId || all) {
    console.log("Also cleaning contacts for bad ws_accounts (error/banned)...");
    const badAccounts = await db("ws_accounts")
      .whereIn("status", ["error", "banned"])
      .select("id");
    for (const acc of badAccounts) {
      const del = await db("contacts").where({ assigned_ws_account_id: acc.id }).del();
      console.log(`Removed ${del} contacts for bad account ${acc.id}`);
    }
  }

  if (dry) {
    console.log("\nThis was a dry run. Re-run with --confirm to actually delete.");
  } else {
    console.log("\nCleanup done.");
  }
  process.exit(0);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
