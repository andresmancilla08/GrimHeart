"use server";

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import { getSession } from "@/lib/auth/session";
import { CLASS_DEFS, type SubclassKey } from "@/lib/daggerheart/classes";
import { ARMOR_BY_ID, WEAPONS_BY_ID } from "@/lib/daggerheart/equipment";
import type { Character, ClassKey, AncestryKey, CommunityKey, CharacterTraits, TraitKey, JournalEntry } from "@/lib/daggerheart/types";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface CreateCharacterInput {
  name: string;
  pronouns: string;
  classKey: ClassKey;
  subclassKey: SubclassKey;
  ancestryKey: AncestryKey;
  communityKey: CommunityKey;
  traits: CharacterTraits;
  domainCardIds: string[];
  primaryWeaponId: string;
  secondaryWeaponId: string | null;
  armorId: string | null;
  experiences: [string, string];
}

/**
 * Derivation rules version. Bump when deriveBaseStats changes so the migration
 * (scripts/migrate-rules.cjs) can apply the delta exactly once per character.
 */
export const CURRENT_RULES_VERSION = 2;

/** Base stats derived from class + equipment + ancestry (level-1 baseline). Shared by create/update. */
function deriveBaseStats(input: CreateCharacterInput) {
  const classDef = CLASS_DEFS[input.classKey];
  const armor = input.armorId ? ARMOR_BY_ID[input.armorId] : null;
  const primaryWeapon = WEAPONS_BY_ID[input.primaryWeaponId];
  const secondaryWeapon = input.secondaryWeaponId
    ? WEAPONS_BY_ID[input.secondaryWeaponId]
    : null;

  let evasion = classDef.evasion;
  let hpMax = classDef.hp;
  let stressMax = 6;
  let armorScore = armor?.score ?? 0;

  // ── Equipment automatics ──
  if (armor?.featureKey === "flexible")  evasion += 1;
  if (armor?.featureKey === "heavy")     evasion -= 1;
  if (armor?.featureKey === "veryHeavy") evasion -= 2;
  if (primaryWeapon?.featureKey === "massive") evasion -= 1;
  if (primaryWeapon?.featureKey === "heavy")   evasion -= 1;
  // Round Shield "Protective": +1 Armor Score (passive while equipped).
  if (secondaryWeapon?.featureKey === "protective") armorScore += 1;

  // ── Ancestry passive bonuses applied at character creation (CoreBook ch.1) ──
  // Only the permanent baseline bonuses are auto-applied; situational features
  // are shown as ability text on the sheet, not folded into stats.
  if (input.ancestryKey === "simiah") evasion += 1;  // Nimble: +1 Evasion
  if (input.ancestryKey === "giant")  hpMax += 1;     // Endurance: +1 Hit Point slot
  if (input.ancestryKey === "human")  stressMax += 1; // High Stamina: +1 Stress slot

  return { evasion, hpMax, stressMax, armorScore };
}

export async function createCharacter(input: CreateCharacterInput): Promise<{ id: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "auth.errors.unknown" };

  const { evasion, hpMax, stressMax, armorScore } = deriveBaseStats(input);

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const pronouns = input.pronouns?.trim() || null;

  const character: Omit<Character, "id"> = {
    userId: session.uid,
    name: input.name.trim(),
    ...(pronouns ? { pronouns } : {}),
    classKey: input.classKey,
    subclassKey: input.subclassKey,
    ancestryKey: input.ancestryKey,
    communityKey: input.communityKey,
    level: 1,
    traits: input.traits,
    evasion,
    hpMax,
    hpMarked: 0,
    stressMax,
    stressMarked: 0,
    hope: 2,
    proficiency: 1,
    armorScore,
    experiences: [
      { id: "exp1", name: input.experiences[0], modifier: 2 },
      { id: "exp2", name: input.experiences[1], modifier: 2 },
    ],
    boostedTraits: [],
    loadout: input.domainCardIds,
    vault: [],
    equipment: {
      weapons: [
        { id: input.primaryWeaponId, slot: "primary" as const },
        ...(input.secondaryWeaponId ? [{ id: input.secondaryWeaponId, slot: "secondary" as const }] : []),
      ],
      armorId: input.armorId,
      itemIds: [],
    },
    backgroundAnswers: {},
    connections: [],
    createdAt: now,
    updatedAt: now,
    rulesVersion: CURRENT_RULES_VERSION,
  };

  await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .doc(id)
    .set({ ...character, id });

  return { id };
}

export async function listCharacters(): Promise<Character[]> {
  const session = await getSession();
  if (!session) redirect("/login");

  const snap = await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map((d) => d.data() as Character);
}

export async function getCharacter(id: string): Promise<Character | null> {
  const session = await getSession();
  if (!session) return null;

  const doc = await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .doc(id)
    .get();

  return doc.exists ? (doc.data() as Character) : null;
}

export async function updateCharacter(
  id: string,
  input: CreateCharacterInput,
): Promise<{ id: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "auth.errors.unknown" };

  const ref = adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .doc(id);

  const doc = await ref.get();
  if (!doc.exists) return { error: "character.errors.notFound" };

  const existing = doc.data() as Character;
  // Editing is only allowed before any level-up; afterwards stats/progress would desync.
  if (existing.level > 1) return { error: "character.errors.editLocked" };

  const { evasion, hpMax, stressMax, armorScore } = deriveBaseStats(input);
  const now = new Date().toISOString();
  const pronouns = input.pronouns?.trim() || null;

  const update: Record<string, unknown> = {
    name: input.name.trim(),
    // Set when provided, otherwise remove the field from the doc.
    pronouns: pronouns ?? FieldValue.delete(),
    classKey: input.classKey,
    subclassKey: input.subclassKey,
    ancestryKey: input.ancestryKey,
    communityKey: input.communityKey,
    traits: input.traits,
    evasion,
    hpMax,
    stressMax,
    // Keep tracked combat state coherent with new maxima.
    hpMarked: Math.min(existing.hpMarked, hpMax),
    stressMarked: Math.min(existing.stressMarked, stressMax),
    armorScore,
    experiences: [
      { id: "exp1", name: input.experiences[0], modifier: 2 },
      { id: "exp2", name: input.experiences[1], modifier: 2 },
    ],
    loadout: input.domainCardIds,
    equipment: {
      weapons: [
        { id: input.primaryWeaponId, slot: "primary" as const },
        ...(input.secondaryWeaponId ? [{ id: input.secondaryWeaponId, slot: "secondary" as const }] : []),
      ],
      armorId: input.armorId,
      itemIds: existing.equipment.itemIds ?? [],
    },
    updatedAt: now,
    rulesVersion: CURRENT_RULES_VERSION,
  };

  await ref.update(update);
  revalidatePath("/characters");
  revalidatePath(`/characters/${id}`);
  return { id };
}

export async function deleteCharacter(id: string): Promise<{ ok: true } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "auth.errors.unknown" };

  await adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .doc(id)
    .delete();

  revalidatePath("/characters");
  return { ok: true };
}

// ── Journal (campaign log) ────────────────────────────────────────────────

async function journalRef(characterId: string) {
  const session = await getSession();
  if (!session) return null;
  return adminDb()
    .collection("users")
    .doc(session.uid)
    .collection("characters")
    .doc(characterId);
}

export async function addJournalEntry(
  characterId: string,
  input: { title?: string; body: string },
): Promise<{ ok: true } | { error: string }> {
  const body = input.body?.trim();
  if (!body) return { error: "journal.errors.empty" };

  const ref = await journalRef(characterId);
  if (!ref) return { error: "auth.errors.unknown" };
  const doc = await ref.get();
  if (!doc.exists) return { error: "character.errors.notFound" };

  const now = new Date().toISOString();
  const entry: JournalEntry = {
    id: crypto.randomUUID(),
    body,
    createdAt: now,
    ...(input.title?.trim() ? { title: input.title.trim() } : {}),
  };

  const journal = [...((doc.data() as Character).journal ?? []), entry];
  await ref.update({ journal, updatedAt: now });
  revalidatePath(`/characters/${characterId}/journal`);
  return { ok: true };
}

export async function updateJournalEntry(
  characterId: string,
  entryId: string,
  input: { title?: string; body: string },
): Promise<{ ok: true } | { error: string }> {
  const body = input.body?.trim();
  if (!body) return { error: "journal.errors.empty" };

  const ref = await journalRef(characterId);
  if (!ref) return { error: "auth.errors.unknown" };
  const doc = await ref.get();
  if (!doc.exists) return { error: "character.errors.notFound" };

  const now = new Date().toISOString();
  const title = input.title?.trim();
  const journal = ((doc.data() as Character).journal ?? []).map((e) =>
    e.id === entryId
      ? { id: e.id, body, createdAt: e.createdAt, updatedAt: now, ...(title ? { title } : {}) }
      : e,
  );
  await ref.update({ journal, updatedAt: now });
  revalidatePath(`/characters/${characterId}/journal`);
  return { ok: true };
}

export async function deleteJournalEntry(
  characterId: string,
  entryId: string,
): Promise<{ ok: true } | { error: string }> {
  const ref = await journalRef(characterId);
  if (!ref) return { error: "auth.errors.unknown" };
  const doc = await ref.get();
  if (!doc.exists) return { error: "character.errors.notFound" };

  const journal = ((doc.data() as Character).journal ?? []).filter((e) => e.id !== entryId);
  await ref.update({ journal, updatedAt: new Date().toISOString() });
  revalidatePath(`/characters/${characterId}/journal`);
  return { ok: true };
}

export type LevelUpAdvancement =
  | { type: "boostTraits"; traits: [TraitKey, TraitKey] }
  | { type: "hp" }
  | { type: "stress" }
  | { type: "experiences"; experienceIds: [string, string] }
  | { type: "domainCard"; cardId: string }
  | { type: "evasion" }
  | { type: "proficiency" };

export async function levelUpCharacter(
  characterId: string,
  advancements: [LevelUpAdvancement, LevelUpAdvancement]
): Promise<{ ok: true } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "auth.errors.unknown" };

  const uid = session.uid;
  const doc = await adminDb()
    .collection("users")
    .doc(uid)
    .collection("characters")
    .doc(characterId)
    .get();

  if (!doc.exists) return { error: "character.errors.notFound" };

  const character = doc.data() as Character;

  if (character.level >= 10) return { error: "character.errors.maxLevel" };

  const newLevel = character.level + 1;

  // Derive tier from new level
  const newTier: 1 | 2 | 3 | 4 =
    newLevel === 1 ? 1
    : newLevel <= 4 ? 2
    : newLevel <= 7 ? 3
    : 4;

  const now = new Date().toISOString();

  // Mutable copies of arrays/objects we may modify
  let hpMax = character.hpMax;
  let stressMax = character.stressMax;
  let evasion = character.evasion;
  let proficiency = character.proficiency;
  const traits = { ...character.traits };
  const experiences = [...character.experiences];
  const loadout = [...character.loadout];
  let boostedTraits: TraitKey[] = [...(character.boostedTraits ?? [])];

  // Level achievement at levels 2, 5, 8
  if (newLevel === 2 || newLevel === 5 || newLevel === 8) {
    experiences.push({ id: crypto.randomUUID(), name: "New Experience", modifier: 2 });
    proficiency += 1;
    if (newLevel === 5 || newLevel === 8) {
      boostedTraits = [];
    }
  }

  // Apply each advancement
  for (const advancement of advancements) {
    switch (advancement.type) {
      case "hp":
        hpMax += 1;
        break;
      case "stress":
        stressMax += 1;
        break;
      case "evasion":
        evasion += 1;
        break;
      case "proficiency":
        proficiency += 1;
        break;
      case "boostTraits":
        for (const trait of advancement.traits) {
          traits[trait] += 1;
          boostedTraits.push(trait);
        }
        break;
      case "experiences":
        for (const expId of advancement.experienceIds) {
          const idx = experiences.findIndex((e) => e.id === expId);
          if (idx !== -1) {
            experiences[idx] = { ...experiences[idx], modifier: experiences[idx].modifier + 1 };
          }
        }
        break;
      case "domainCard":
        loadout.push(advancement.cardId);
        break;
    }
  }

  const updatePayload: Partial<Character> & { updatedAt: string } = {
    level: newLevel,
    hpMax,
    stressMax,
    evasion,
    proficiency,
    traits,
    experiences,
    loadout,
    boostedTraits,
    updatedAt: now,
  };

  // newTier is derived but we store it so downstream reads are cheap
  // (Character interface doesn't have a tier field currently — omit it)
  void newTier;

  await adminDb()
    .collection("users")
    .doc(uid)
    .collection("characters")
    .doc(characterId)
    .update(updatePayload);

  return { ok: true };
}
