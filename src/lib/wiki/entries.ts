// Wiki entry definitions. All display text is resolved via i18n keys — never hardcoded.
// Source: CoreBook (via reference.ts and equipment.ts).

import { ANCESTRIES, COMMUNITIES, CLASSES, DOMAINS } from "@/lib/daggerheart/reference";
import {
  PRIMARY_WEAPONS,
  SECONDARY_WEAPONS,
  ARMORS,
  type WeaponDef,
  type ArmorDef,
} from "@/lib/daggerheart/equipment";

export type WikiCategory =
  | "ancestry"
  | "community"
  | "class"
  | "domain"
  | "equipment"
  | "rules";

export interface WikiEntry {
  id: string;
  category: WikiCategory;
  nameKey: string;
  descKey: string;
  /** Full CoreBook lore, shown in the detail view (falls back to descKey). */
  loreKey?: string;
  tags?: string[];
  detailKeys?: Record<string, string>;
}

// ── Equipment display data (name + raw stats for i18n-resolved descriptions) ──
// Weapon/armor names are proper nouns and are not translated.
// Descriptions are assembled in WikiContent using t() so labels stay localized.

export interface EquipDisplayEntry {
  name: string;
  /** Raw stats the component uses to build a localized description via t(). */
  stats: Record<string, string>;
  isArmor: boolean;
}

export const EQUIP_DISPLAY: Record<string, EquipDisplayEntry> = Object.fromEntries([
  ...[...PRIMARY_WEAPONS, ...SECONDARY_WEAPONS].map((w) => [
    w.id,
    {
      name: w.name,
      isArmor: false,
      stats: {
        dmgType: w.dmgType,
        damage: w.damage,
        range: w.range,
        burden: w.burden,
        featureKey: w.featureKey ?? "",
        requiresSpellcast: w.requiresSpellcast ? "1" : "",
      },
    } satisfies EquipDisplayEntry,
  ]),
  ...ARMORS.map((a) => [
    a.id,
    {
      name: a.name,
      isArmor: true,
      stats: {
        score: String(a.score),
        minor: String(a.minorThreshold),
        severe: String(a.severeThreshold),
        featureKey: a.featureKey ?? "",
      },
    } satisfies EquipDisplayEntry,
  ]),
]);

// ── Ancestries ───────────────────────────────────────────────────────────────

const ancestryEntries: WikiEntry[] = ANCESTRIES.map((key) => ({
  id: `ancestry_${key}`,
  category: "ancestry",
  nameKey: `dh.ancestry.${key}`,
  descKey: `dh.ancestry.${key}_desc`,
  loreKey: `dh.ancestry.${key}_lore`,
}));

// ── Communities ──────────────────────────────────────────────────────────────

const communityEntries: WikiEntry[] = COMMUNITIES.map((key) => ({
  id: `community_${key}`,
  category: "community",
  nameKey: `dh.community.${key}`,
  descKey: `dh.community.${key}_desc`,
  loreKey: `dh.community.${key}_lore`,
}));

// ── Classes ──────────────────────────────────────────────────────────────────

const classEntries: WikiEntry[] = CLASSES.map((key) => ({
  id: `class_${key}`,
  category: "class",
  nameKey: `dh.class.${key}`,
  descKey: `dh.class.${key}_desc`,
  loreKey: `dh.class.${key}_lore`,
}));

// ── Domains ──────────────────────────────────────────────────────────────────

const domainEntries: WikiEntry[] = DOMAINS.map((key) => ({
  id: `domain_${key}`,
  category: "domain",
  nameKey: `dh.domain.${key}`,
  descKey: `dh.domain.${key}_wiki_desc`,
  loreKey: `dh.domain.${key}_lore`,
}));

// ── Equipment ────────────────────────────────────────────────────────────────

const primaryWeaponEntries: WikiEntry[] = PRIMARY_WEAPONS.map((w) => ({
  id: `equip_${w.id}`,
  category: "equipment",
  nameKey: `equip.${w.id}.name`,
  descKey: `equip.${w.id}.desc`,
  tags: [w.burden, w.range, w.trait, w.dmgType, w.damage],
  detailKeys: {
    damage: w.damage,
    range: w.range,
    trait: w.trait,
    burden: w.burden,
  },
}));

const secondaryWeaponEntries: WikiEntry[] = SECONDARY_WEAPONS.map((w) => ({
  id: `equip_${w.id}`,
  category: "equipment",
  nameKey: `equip.${w.id}.name`,
  descKey: `equip.${w.id}.desc`,
  tags: [w.burden, w.range, w.trait, w.dmgType, w.damage],
  detailKeys: {
    damage: w.damage,
    range: w.range,
    trait: w.trait,
    burden: w.burden,
  },
}));

const armorEntries: WikiEntry[] = ARMORS.map((a) => ({
  id: `equip_${a.id}`,
  category: "equipment",
  nameKey: `equip.${a.id}.name`,
  descKey: `equip.${a.id}.desc`,
  tags: [`score_${a.score}`, `minor_${a.minorThreshold}`, `severe_${a.severeThreshold}`],
  detailKeys: {
    score: String(a.score),
    minor: String(a.minorThreshold),
    severe: String(a.severeThreshold),
  },
}));

// ── Rules ────────────────────────────────────────────────────────────────────

const rulesEntries: WikiEntry[] = [
  {
    id: "hope_fear",
    category: "rules",
    nameKey: "wiki.rules.hopeFear",
    descKey: "wiki.rules.hopeFear_desc",
  },
  {
    id: "damage",
    category: "rules",
    nameKey: "wiki.rules.damage",
    descKey: "wiki.rules.damage_desc",
  },
  {
    id: "rolls",
    category: "rules",
    nameKey: "wiki.rules.rolls",
    descKey: "wiki.rules.rolls_desc",
  },
  {
    id: "rests",
    category: "rules",
    nameKey: "wiki.rules.rests",
    descKey: "wiki.rules.rests_desc",
  },
  {
    id: "conditions",
    category: "rules",
    nameKey: "wiki.rules.conditions",
    descKey: "wiki.rules.conditions_desc",
  },
];

// ── All entries ───────────────────────────────────────────────────────────────

export const WIKI_ENTRIES: WikiEntry[] = [
  ...ancestryEntries,
  ...communityEntries,
  ...classEntries,
  ...domainEntries,
  ...primaryWeaponEntries,
  ...secondaryWeaponEntries,
  ...armorEntries,
  ...rulesEntries,
];
