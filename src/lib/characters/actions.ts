"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getSession } from "@/lib/auth/session";
import { CLASS_DEFS, SUBCLASS_DEFS, type SubclassKey } from "@/lib/daggerheart/classes";
import { ARMOR_BY_ID, WEAPONS_BY_ID } from "@/lib/daggerheart/equipment";
import type { Character, ClassKey, AncestryKey, CommunityKey, CharacterTraits } from "@/lib/daggerheart/types";
import { redirect } from "next/navigation";

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

export async function createCharacter(input: CreateCharacterInput): Promise<{ id: string } | { error: string }> {
  const session = await getSession();
  if (!session) return { error: "auth.errors.unknown" };

  const classDef = CLASS_DEFS[input.classKey];
  const subclassDef = SUBCLASS_DEFS[input.subclassKey as SubclassKey];
  const armor = input.armorId ? ARMOR_BY_ID[input.armorId] : null;
  const primaryWeapon = WEAPONS_BY_ID[input.primaryWeaponId];

  // Derive stats from chosen class + equipment
  let evasion = classDef.evasion;
  if (armor?.featureKey === "flexible")  evasion += 1;
  if (armor?.featureKey === "heavy")     evasion -= 1;
  if (armor?.featureKey === "veryHeavy") evasion -= 2;
  if (primaryWeapon?.featureKey === "massive") evasion -= 1;
  if (primaryWeapon?.featureKey === "heavy")   evasion -= 1;

  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const character: Omit<Character, "id"> = {
    userId: session.uid,
    name: input.name.trim(),
    pronouns: input.pronouns.trim() || undefined,
    classKey: input.classKey,
    subclassKey: input.subclassKey,
    ancestryKey: input.ancestryKey,
    communityKey: input.communityKey,
    level: 1,
    traits: input.traits,
    evasion,
    hpMax: classDef.hp,
    hpMarked: 0,
    stressMax: 6,
    stressMarked: 0,
    hope: 2,
    proficiency: 1,
    armorScore: armor?.score ?? 0,
    experiences: [
      { id: "exp1", name: input.experiences[0], modifier: 2 },
      { id: "exp2", name: input.experiences[1], modifier: 2 },
    ],
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
