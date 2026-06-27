// Core Daggerheart domain model (SRD-based, under the Darrington Press Community Gaming License).
// Reference content text is loaded separately; these are the structural types used by the app.

export type TraitKey =
  | "agility"
  | "strength"
  | "finesse"
  | "instinct"
  | "presence"
  | "knowledge";

export type DomainKey =
  | "arcana"
  | "blade"
  | "bone"
  | "codex"
  | "grace"
  | "midnight"
  | "sage"
  | "splendor"
  | "valor";

export type ClassKey =
  | "bard"
  | "druid"
  | "guardian"
  | "ranger"
  | "rogue"
  | "seraph"
  | "sorcerer"
  | "warrior"
  | "wizard";

export type AncestryKey =
  | "clank"
  | "drakona"
  | "dwarf"
  | "elf"
  | "faerie"
  | "faun"
  | "firbolg"
  | "fungril"
  | "galapa"
  | "giant"
  | "goblin"
  | "halfling"
  | "human"
  | "infernis"
  | "katari"
  | "orc"
  | "ribbet"
  | "simiah";

export type CommunityKey =
  | "highborne"
  | "loreborne"
  | "orderborne"
  | "ridgeborne"
  | "seaborne"
  | "slyborne"
  | "underborne"
  | "wanderborne"
  | "wildborne";

/** Tiers gate which level-up options are available. Tier 1 = lvl 1, Tier 2 = 2-4, Tier 3 = 5-7, Tier 4 = 8-10. */
export type Tier = 1 | 2 | 3 | 4;

export interface DomainCard {
  id: string;
  domain: DomainKey;
  level: number;
  /** "ability" | "spell" | "grimoire" — narrows which cards are spells. */
  type: "ability" | "spell" | "grimoire";
}

export interface CharacterTraits {
  agility: number;
  strength: number;
  finesse: number;
  instinct: number;
  presence: number;
  knowledge: number;
}

export interface Experience {
  id: string;
  name: string;
  modifier: number; // typically +2
}

/** A player-written log entry recording events of the character's story. */
export interface JournalEntry {
  id: string;
  title?: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EquippedWeapon {
  id: string;
  slot: "primary" | "secondary";
}

export interface CharacterEquipment {
  weapons: EquippedWeapon[];
  armorId: string | null;
  itemIds: string[];
}

/** A player-owned character sheet. */
export interface Character {
  id: string;
  userId: string;
  name: string;
  pronouns?: string;

  classKey: ClassKey;
  subclassKey: string;
  ancestryKey: AncestryKey;
  communityKey: CommunityKey;

  level: number; // 1-10
  traits: CharacterTraits;

  // Derived/tracked stats
  evasion: number;
  hpMax: number;
  hpMarked: number;
  stressMax: number;
  stressMarked: number;
  hope: number; // 0-6
  proficiency: number;
  armorScore: number;

  experiences: Experience[];
  boostedTraits: TraitKey[];

  // Domain cards: active loadout vs. stored vault.
  loadout: string[]; // DomainCard ids
  vault: string[];

  equipment: CharacterEquipment;

  // Background & connections (chosen during creation).
  backgroundAnswers: Record<string, string>;
  connections: string[];

  // Player-written campaign log (newest first when displayed).
  journal?: JournalEntry[];

  createdAt: string;
  updatedAt: string;

  /**
   * Derivation rules version baked into the stored stats. Bumped when the
   * formula for baseline stats changes (e.g. auto-applied ancestry/equipment
   * bonuses) so a migration can apply the delta exactly once per character.
   */
  rulesVersion?: number;
}
