import type { ClassKey, AncestryKey, CommunityKey, TraitKey } from "@/lib/daggerheart/types";
import type { SubclassKey } from "@/lib/daggerheart/classes";

export interface WizardData {
  name: string;
  pronouns: string;
  classKey: ClassKey | null;
  subclassKey: SubclassKey | null;
  ancestryKey: AncestryKey | null;
  communityKey: CommunityKey | null;
  traits: Record<TraitKey, number | null>;
  pendingModifier: number | null;
  domainCardIds: string[];
  primaryWeaponId: string | null;
  secondaryWeaponId: string | null;
  armorId: string | null;
  exp1: string;
  exp2: string;
}

export const EMPTY_TRAITS: Record<TraitKey, number | null> = {
  agility: null,
  strength: null,
  finesse: null,
  instinct: null,
  presence: null,
  knowledge: null,
};

export const INITIAL_DATA: WizardData = {
  name: "",
  pronouns: "",
  classKey: null,
  subclassKey: null,
  ancestryKey: null,
  communityKey: null,
  traits: { ...EMPTY_TRAITS },
  pendingModifier: null,
  domainCardIds: [],
  primaryWeaponId: null,
  secondaryWeaponId: null,
  armorId: null,
  exp1: "",
  exp2: "",
};

export const STEP_KEYS = [
  "identity", "class", "heritage", "traits",
  "cards", "equipment", "background", "review",
] as const;

export type StepKey = (typeof STEP_KEYS)[number];
