// Level 1 domain cards. Source: CoreBook Appendix p.329-332+.
// Higher levels added as characters level up.

import type { DomainKey } from "./types";

export type CardType = "ability" | "spell" | "grimoire";

export interface DomainCardDef {
  id: string;
  domain: DomainKey;
  level: number;
  type: CardType;
  recallCost: number;
}

const c = (
  id: string,
  domain: DomainKey,
  level: number,
  type: CardType,
  recallCost: number,
): DomainCardDef => ({ id, domain, level, type, recallCost });

// Arcana L1 (CoreBook p.329)
// Blade L1 (CoreBook p.330)
// Bone L1 (CoreBook p.332)
// Codex L1 (CoreBook p.333)
// Grace L1 (CoreBook p.335)
// Midnight L1 (CoreBook p.337)
// Sage L1 (CoreBook p.339)
// Splendor L1 (CoreBook p.341)
// Valor L1 (CoreBook p.343)
export const DOMAIN_CARDS: DomainCardDef[] = [
  c("arcana_rune_ward",      "arcana",   1, "spell",    0),
  c("arcana_unleash_chaos",  "arcana",   1, "spell",    1),
  c("arcana_wall_walk",      "arcana",   1, "spell",    1),

  c("blade_get_back_up",     "blade",    1, "ability",  1),
  c("blade_not_good_enough", "blade",    1, "ability",  1),
  c("blade_whirlwind",       "blade",    1, "ability",  0),

  c("bone_deft_maneuvers",   "bone",     1, "ability",  0),
  c("bone_i_see_it_coming",  "bone",     1, "ability",  1),
  c("bone_untouchable",      "bone",     1, "ability",  1),

  c("codex_book_of_ava",     "codex",    1, "grimoire", 2),
  c("codex_book_of_illiat",  "codex",    1, "grimoire", 2),
  c("codex_book_of_tyfar",   "codex",    1, "grimoire", 2),

  c("grace_deft_deceiver",   "grace",    1, "ability",  0),
  c("grace_enrapture",       "grace",    1, "spell",    0),
  c("grace_inspirational",   "grace",    1, "ability",  1),

  c("midnight_pick_pull",    "midnight", 1, "ability",  0),
  c("midnight_rain_blades",  "midnight", 1, "spell",    1),
  c("midnight_disguise",     "midnight", 1, "spell",    0),

  c("sage_gifted_tracker",   "sage",     1, "ability",  0),
  c("sage_natures_tongue",   "sage",     1, "ability",  0),
  c("sage_vicious_entangle", "sage",     1, "spell",    1),

  c("splendor_bolt_beacon",  "splendor", 1, "spell",    1),
  c("splendor_mending_touch","splendor", 1, "spell",    1),
  c("splendor_reassurance",  "splendor", 1, "ability",  0),

  c("valor_bare_bones",      "valor",    1, "ability",  0),
  c("valor_forceful_push",   "valor",    1, "ability",  0),
  c("valor_i_am_shield",     "valor",    1, "ability",  1),
];

export const CARDS_BY_ID = Object.fromEntries(DOMAIN_CARDS.map((c) => [c.id, c]));

export function cardsForDomains(domains: [DomainKey, DomainKey], level = 1): DomainCardDef[] {
  return DOMAIN_CARDS.filter((c) => domains.includes(c.domain) && c.level <= level);
}
