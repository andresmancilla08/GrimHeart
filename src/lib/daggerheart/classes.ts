import type { ClassKey, DomainKey, TraitKey } from "./types";

export type SubclassKey =
  | "troubadour" | "wordsmith"
  | "wardenElements" | "wardenRenewal"
  | "stalwart" | "vengeance"
  | "beastbound" | "wayfinder"
  | "nightwalker" | "syndicate"
  | "divineWielder" | "wingedSentinel"
  | "elementalOrigin" | "primalOrigin"
  | "callBrave" | "callSlayer"
  | "schoolKnowledge" | "schoolWar";

export interface SubclassDef {
  key: SubclassKey;
  classKey: ClassKey;
  spellcastTrait: TraitKey | null;
}

export interface ClassDef {
  key: ClassKey;
  domains: [DomainKey, DomainKey];
  evasion: number;
  hp: number;
  subclasses: [SubclassKey, SubclassKey];
}

export const SUBCLASS_DEFS: Record<SubclassKey, SubclassDef> = {
  troubadour:      { key: "troubadour",      classKey: "bard",     spellcastTrait: "presence" },
  wordsmith:       { key: "wordsmith",        classKey: "bard",     spellcastTrait: "presence" },
  wardenElements:  { key: "wardenElements",   classKey: "druid",    spellcastTrait: "instinct" },
  wardenRenewal:   { key: "wardenRenewal",    classKey: "druid",    spellcastTrait: "instinct" },
  stalwart:        { key: "stalwart",         classKey: "guardian", spellcastTrait: null },
  vengeance:       { key: "vengeance",        classKey: "guardian", spellcastTrait: null },
  beastbound:      { key: "beastbound",       classKey: "ranger",   spellcastTrait: "agility" },
  wayfinder:       { key: "wayfinder",        classKey: "ranger",   spellcastTrait: "agility" },
  nightwalker:     { key: "nightwalker",      classKey: "rogue",    spellcastTrait: "finesse" },
  syndicate:       { key: "syndicate",        classKey: "rogue",    spellcastTrait: "finesse" },
  divineWielder:   { key: "divineWielder",    classKey: "seraph",   spellcastTrait: "strength" },
  wingedSentinel:  { key: "wingedSentinel",   classKey: "seraph",   spellcastTrait: "strength" },
  elementalOrigin: { key: "elementalOrigin",  classKey: "sorcerer", spellcastTrait: "instinct" },
  primalOrigin:    { key: "primalOrigin",     classKey: "sorcerer", spellcastTrait: "instinct" },
  callBrave:       { key: "callBrave",        classKey: "warrior",  spellcastTrait: null },
  callSlayer:      { key: "callSlayer",       classKey: "warrior",  spellcastTrait: null },
  schoolKnowledge: { key: "schoolKnowledge",  classKey: "wizard",   spellcastTrait: "knowledge" },
  schoolWar:       { key: "schoolWar",        classKey: "wizard",   spellcastTrait: "knowledge" },
};

// Source: CoreBook pages 29-68 (Evasion + HP per class)
export const CLASS_DEFS: Record<ClassKey, ClassDef> = {
  bard:     { key: "bard",     domains: ["grace", "codex"],     evasion: 10, hp: 5, subclasses: ["troubadour",      "wordsmith"] },
  druid:    { key: "druid",    domains: ["sage", "arcana"],     evasion: 10, hp: 6, subclasses: ["wardenElements",  "wardenRenewal"] },
  guardian: { key: "guardian", domains: ["valor", "blade"],     evasion: 9,  hp: 7, subclasses: ["stalwart",        "vengeance"] },
  ranger:   { key: "ranger",   domains: ["bone", "sage"],       evasion: 12, hp: 6, subclasses: ["beastbound",      "wayfinder"] },
  rogue:    { key: "rogue",    domains: ["midnight", "grace"],  evasion: 12, hp: 6, subclasses: ["nightwalker",     "syndicate"] },
  seraph:   { key: "seraph",   domains: ["splendor", "valor"],  evasion: 9,  hp: 7, subclasses: ["divineWielder",   "wingedSentinel"] },
  sorcerer: { key: "sorcerer", domains: ["arcana", "midnight"], evasion: 10, hp: 6, subclasses: ["elementalOrigin", "primalOrigin"] },
  warrior:  { key: "warrior",  domains: ["blade", "bone"],      evasion: 11, hp: 6, subclasses: ["callBrave",       "callSlayer"] },
  wizard:   { key: "wizard",   domains: ["codex", "splendor"],  evasion: 11, hp: 5, subclasses: ["schoolKnowledge", "schoolWar"] },
};
