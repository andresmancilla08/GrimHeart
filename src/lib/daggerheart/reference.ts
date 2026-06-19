// Canonical Daggerheart reference lists (SRD). Display names are resolved via i18n keys
// (e.g. `dh.class.bard`) so the UI stays fully localized in EN/ES.

import type {
  AncestryKey,
  ClassKey,
  CommunityKey,
  DomainKey,
  TraitKey,
} from "./types";

export const TRAITS: TraitKey[] = [
  "agility",
  "strength",
  "finesse",
  "instinct",
  "presence",
  "knowledge",
];

/** Standard array assigned across the six traits at character creation. */
export const TRAIT_ARRAY = [2, 1, 1, 0, 0, -1] as const;

export const DOMAINS: DomainKey[] = [
  "arcana",
  "blade",
  "bone",
  "codex",
  "grace",
  "midnight",
  "sage",
  "splendor",
  "valor",
];

export const ANCESTRIES: AncestryKey[] = [
  "clank",
  "drakona",
  "dwarf",
  "elf",
  "faerie",
  "faun",
  "firbolg",
  "fungril",
  "galapa",
  "giant",
  "goblin",
  "halfling",
  "human",
  "infernis",
  "katari",
  "orc",
  "ribbet",
  "simiah",
];

export const COMMUNITIES: CommunityKey[] = [
  "highborne",
  "loreborne",
  "orderborne",
  "ridgeborne",
  "seaborne",
  "slyborne",
  "underborne",
  "wanderborne",
  "wildborne",
];

/** Each class draws domain cards from exactly two domains. */
export const CLASS_DOMAINS: Record<ClassKey, [DomainKey, DomainKey]> = {
  bard: ["grace", "codex"],
  druid: ["sage", "arcana"],
  guardian: ["valor", "blade"],
  ranger: ["bone", "sage"],
  rogue: ["midnight", "grace"],
  seraph: ["splendor", "valor"],
  sorcerer: ["arcana", "midnight"],
  warrior: ["blade", "bone"],
  wizard: ["codex", "splendor"],
};

export const CLASSES: ClassKey[] = Object.keys(CLASS_DOMAINS) as ClassKey[];

/** Level -> tier mapping. Tiers gate available advancements and card levels. */
export function tierForLevel(level: number): 1 | 2 | 3 | 4 {
  if (level <= 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  return 4;
}
