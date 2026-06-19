// Tier 1 starting equipment. Source: CoreBook Chapter 2, p.115–127.

import type { TraitKey } from "./types";

export type WeaponRange = "melee" | "veryClose" | "close" | "far" | "veryFar";
export type DamageType = "phy" | "mag";
export type WeaponBurden = "oneHanded" | "twoHanded";

export interface WeaponDef {
  id: string;
  name: string;
  trait: TraitKey;
  range: WeaponRange;
  damage: string;
  burden: WeaponBurden;
  feature?: string;
  requiresSpellcast?: boolean;
  secondary?: boolean;
  dmgType: DamageType;
}

export interface ArmorDef {
  id: string;
  name: string;
  minorThreshold: number;
  severeThreshold: number;
  score: number;
  feature?: string;
}

export const PRIMARY_WEAPONS: WeaponDef[] = [
  // Physical
  { id: "broadsword",   name: "Broadsword",   trait: "agility",   range: "melee",    damage: "d8",    burden: "oneHanded", feature: "Reliable: +1 to attack rolls",                         dmgType: "phy" },
  { id: "longsword",    name: "Longsword",    trait: "agility",   range: "melee",    damage: "d10+3", burden: "twoHanded",                                                                  dmgType: "phy" },
  { id: "battleaxe",    name: "Battleaxe",    trait: "strength",  range: "melee",    damage: "d10+3", burden: "twoHanded",                                                                  dmgType: "phy" },
  { id: "greatsword",   name: "Greatsword",   trait: "strength",  range: "melee",    damage: "d10+3", burden: "twoHanded", feature: "Massive: −1 Evasion; extra damage die on hit (discard lowest)", dmgType: "phy" },
  { id: "mace",         name: "Mace",         trait: "strength",  range: "melee",    damage: "d8+1",  burden: "oneHanded",                                                                  dmgType: "phy" },
  { id: "warhammer",    name: "Warhammer",    trait: "strength",  range: "melee",    damage: "d12+3", burden: "twoHanded", feature: "Heavy: −1 to Evasion",                                 dmgType: "phy" },
  { id: "dagger",       name: "Dagger",       trait: "finesse",   range: "melee",    damage: "d8+1",  burden: "oneHanded",                                                                  dmgType: "phy" },
  { id: "quarterstaff", name: "Quarterstaff", trait: "instinct",  range: "melee",    damage: "d10+3", burden: "twoHanded",                                                                  dmgType: "phy" },
  { id: "cutlass",      name: "Cutlass",      trait: "presence",  range: "melee",    damage: "d8+1",  burden: "oneHanded",                                                                  dmgType: "phy" },
  { id: "rapier",       name: "Rapier",       trait: "presence",  range: "melee",    damage: "d8",    burden: "oneHanded", feature: "Quick: mark Stress to target another creature",        dmgType: "phy" },
  { id: "halberd",      name: "Halberd",      trait: "strength",  range: "veryClose",damage: "d10+2", burden: "twoHanded", feature: "Cumbersome: −1 to Finesse",                            dmgType: "phy" },
  { id: "spear",        name: "Spear",        trait: "finesse",   range: "veryClose",damage: "d8+3",  burden: "twoHanded",                                                                  dmgType: "phy" },
  { id: "shortbow",     name: "Shortbow",     trait: "agility",   range: "far",      damage: "d6+3",  burden: "twoHanded",                                                                  dmgType: "phy" },
  { id: "crossbow",     name: "Crossbow",     trait: "finesse",   range: "far",      damage: "d6+1",  burden: "oneHanded",                                                                  dmgType: "phy" },
  { id: "longbow",      name: "Longbow",      trait: "agility",   range: "veryFar",  damage: "d8+3",  burden: "twoHanded", feature: "Cumbersome: −1 to Finesse",                            dmgType: "phy" },
  // Magic (require spellcast trait)
  { id: "arcane_gauntlets", name: "Arcane Gauntlets", trait: "strength",  range: "melee",    damage: "d10+3", burden: "twoHanded", requiresSpellcast: true, dmgType: "mag" },
  { id: "hallowed_axe",     name: "Hallowed Axe",     trait: "strength",  range: "melee",    damage: "d8+1",  burden: "oneHanded", requiresSpellcast: true, dmgType: "mag" },
  { id: "glowing_rings",    name: "Glowing Rings",    trait: "agility",   range: "veryClose",damage: "d10+2", burden: "twoHanded", requiresSpellcast: true, dmgType: "mag" },
  { id: "hand_runes",       name: "Hand Runes",       trait: "instinct",  range: "veryClose",damage: "d10",   burden: "oneHanded", requiresSpellcast: true, dmgType: "mag" },
  { id: "returning_blade",  name: "Returning Blade",  trait: "finesse",   range: "close",    damage: "d8",    burden: "oneHanded", requiresSpellcast: true, feature: "Returning: returns to hand after attack", dmgType: "mag" },
  { id: "shortstaff",       name: "Shortstaff",       trait: "instinct",  range: "close",    damage: "d8+1",  burden: "oneHanded", requiresSpellcast: true, dmgType: "mag" },
  { id: "dualstaff",        name: "Dualstaff",        trait: "instinct",  range: "far",      damage: "d6+3",  burden: "twoHanded", requiresSpellcast: true, dmgType: "mag" },
  { id: "scepter",          name: "Scepter",          trait: "presence",  range: "far",      damage: "d6",    burden: "twoHanded", requiresSpellcast: true, feature: "Versatile: also Presence/Melee/d8", dmgType: "mag" },
  { id: "wand",             name: "Wand",             trait: "knowledge", range: "far",      damage: "d6+1",  burden: "oneHanded", requiresSpellcast: true, dmgType: "mag" },
  { id: "greatstaff",       name: "Greatstaff",       trait: "knowledge", range: "veryFar",  damage: "d6",    burden: "twoHanded", requiresSpellcast: true, feature: "Powerful: extra damage die (discard lowest)", dmgType: "mag" },
];

export const SECONDARY_WEAPONS: WeaponDef[] = [
  { id: "shortsword",    name: "Shortsword",    trait: "agility",  range: "melee",   damage: "d8",   burden: "oneHanded", feature: "Paired: +2 to primary damage within Melee", secondary: true, dmgType: "phy" },
  { id: "round_shield",  name: "Round Shield",  trait: "strength", range: "melee",   damage: "d4",   burden: "oneHanded", feature: "Protective: +1 to Armor Score",              secondary: true, dmgType: "phy" },
  { id: "tower_shield",  name: "Tower Shield",  trait: "strength", range: "melee",   damage: "d6",   burden: "oneHanded", feature: "Barrier: +2 Armor Score; −1 Evasion",        secondary: true, dmgType: "phy" },
  { id: "small_dagger",  name: "Small Dagger",  trait: "finesse",  range: "melee",   damage: "d8",   burden: "oneHanded", feature: "Paired: +2 to primary damage within Melee", secondary: true, dmgType: "phy" },
  { id: "whip",          name: "Whip",          trait: "presence", range: "veryClose",damage: "d6",  burden: "oneHanded", feature: "Startling: force adjacent foes to Close",   secondary: true, dmgType: "phy" },
  { id: "grappler",      name: "Grappler",      trait: "finesse",  range: "close",   damage: "d6",   burden: "oneHanded", feature: "Hooked: pull target to Melee on hit",        secondary: true, dmgType: "phy" },
  { id: "hand_crossbow", name: "Hand Crossbow", trait: "finesse",  range: "far",     damage: "d6+1", burden: "oneHanded",                                                        secondary: true, dmgType: "phy" },
];

export const ARMORS: ArmorDef[] = [
  { id: "gambeson",   name: "Gambeson Armor",    minorThreshold: 5,  severeThreshold: 11, score: 3, feature: "Flexible: +1 to Evasion" },
  { id: "leather",    name: "Leather Armor",     minorThreshold: 6,  severeThreshold: 13, score: 3 },
  { id: "chainmail",  name: "Chainmail Armor",   minorThreshold: 7,  severeThreshold: 15, score: 4, feature: "Heavy: −1 to Evasion" },
  { id: "full_plate", name: "Full Plate Armor",  minorThreshold: 8,  severeThreshold: 17, score: 4, feature: "Very Heavy: −2 Evasion; −1 Agility" },
];

export const WEAPONS_BY_ID = Object.fromEntries(
  [...PRIMARY_WEAPONS, ...SECONDARY_WEAPONS].map((w) => [w.id, w]),
);

export const ARMOR_BY_ID = Object.fromEntries(ARMORS.map((a) => [a.id, a]));
