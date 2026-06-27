#!/usr/bin/env node
/**
 * One-off migration: apply rules-v2 stat deltas to existing characters.
 *
 * Rules-v2 auto-applies passive ancestry bonuses + the Round Shield armor
 * bonus to baseline stats. Characters created before this change stored the
 * old (lower) numbers. This script ADDS the delta (never overwrites) so it is
 * safe for leveled-up characters, and is idempotent via `rulesVersion`.
 *
 * Auth: uses Application Default Credentials (gcloud auth application-default
 * login) + FIREBASE_PROJECT_ID from .env.local. Read-only unless --apply.
 *
 *   node scripts/migrate-rules.cjs          # dry run (prints planned changes)
 *   node scripts/migrate-rules.cjs --apply  # write changes
 */
const fs = require("fs");
const path = require("path");
const { initializeApp, applicationDefault, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const TARGET_VERSION = 2;
const APPLY = process.argv.includes("--apply");

// Weapon ids whose feature passively raises Armor Score (CoreBook): Round Shield.
const PROTECTIVE_SHIELD_IDS = new Set(["round_shield"]);

function loadProjectId() {
  if (process.env.FIREBASE_PROJECT_ID) return process.env.FIREBASE_PROJECT_ID;
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^FIREBASE_PROJECT_ID=(.*)$/);
      if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    }
  }
  throw new Error("FIREBASE_PROJECT_ID not set (env or .env.local).");
}

/** Delta introduced by rules-v2 for a given character (independent of level). */
function rulesV2Delta(c) {
  const d = { evasion: 0, hpMax: 0, stressMax: 0, armorScore: 0 };
  if (c.ancestryKey === "simiah") d.evasion += 1; // Nimble
  if (c.ancestryKey === "giant") d.hpMax += 1; // Endurance
  if (c.ancestryKey === "human") d.stressMax += 1; // High Stamina
  const weapons = (c.equipment && c.equipment.weapons) || [];
  if (weapons.some((w) => PROTECTIVE_SHIELD_IDS.has(w.id))) d.armorScore += 1; // Protective
  return d;
}

async function main() {
  const projectId = loadProjectId();
  if (!getApps().length) {
    initializeApp({ credential: applicationDefault(), projectId });
  }
  const db = getFirestore();

  const snap = await db.collectionGroup("characters").get();
  let scanned = 0, migrated = 0, skipped = 0;

  for (const doc of snap.docs) {
    scanned++;
    const c = doc.data();
    const version = c.rulesVersion || 1;
    if (version >= TARGET_VERSION) { skipped++; continue; }

    const d = rulesV2Delta(c);
    const update = {
      evasion: (c.evasion || 0) + d.evasion,
      hpMax: (c.hpMax || 0) + d.hpMax,
      stressMax: (c.stressMax || 0) + d.stressMax,
      armorScore: (c.armorScore || 0) + d.armorScore,
      rulesVersion: TARGET_VERSION,
      updatedAt: new Date().toISOString(),
    };

    const changed = d.evasion || d.hpMax || d.stressMax || d.armorScore;
    console.log(
      `${APPLY ? "APPLY" : "DRY"}  ${c.name || doc.id} [${c.ancestryKey}/${c.classKey} L${c.level}]  ` +
      `EV ${c.evasion}->${update.evasion}  HP ${c.hpMax}->${update.hpMax}  ` +
      `ST ${c.stressMax}->${update.stressMax}  AR ${c.armorScore}->${update.armorScore}` +
      (changed ? "" : "  (no stat delta, only version bump)")
    );

    if (APPLY) await doc.ref.update(update);
    migrated++;
  }

  console.log(`\n${APPLY ? "Applied" : "Dry run"}: scanned ${scanned}, migrated ${migrated}, already-current ${skipped}.`);
  if (!APPLY && migrated) console.log("Re-run with --apply to write these changes.");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
