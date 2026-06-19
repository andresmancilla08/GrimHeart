"use client";

import { useTranslation } from "react-i18next";
import { CLASS_DEFS, SUBCLASS_DEFS } from "@/lib/daggerheart/classes";
import { ARMOR_BY_ID, WEAPONS_BY_ID } from "@/lib/daggerheart/equipment";
import { CARDS_BY_ID } from "@/lib/daggerheart/cards";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  error?: string;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border/40 py-2 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-surface-2/30 p-3">
      <span className="font-display text-xl font-bold text-gold">{value}</span>
      <span className="text-center text-[10px] text-muted">{label}</span>
    </div>
  );
}

export function StepReview({ data, error }: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: "wizard.review" });
  const { t: tg } = useTranslation();

  if (!data.classKey) return null;

  const classDef = CLASS_DEFS[data.classKey];
  const subDef = data.subclassKey ? SUBCLASS_DEFS[data.subclassKey] : null;
  const armor = data.armorId ? ARMOR_BY_ID[data.armorId] : null;
  const weapon = data.primaryWeaponId ? WEAPONS_BY_ID[data.primaryWeaponId] : null;
  const cards = data.domainCardIds.map((id) => CARDS_BY_ID[id]).filter(Boolean);

  // Derive evasion for display
  let evasion = classDef.evasion;
  if (armor?.feature?.includes("Flexible")) evasion += 1;
  if (armor?.feature?.includes("Heavy: −1")) evasion -= 1;
  if (armor?.feature?.includes("Very Heavy")) evasion -= 2;
  if (weapon?.feature?.includes("Massive") || weapon?.feature?.includes("Heavy: −1")) evasion -= 1;

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {/* Name */}
      <div className="text-center">
        <p className="font-display text-2xl font-semibold text-foreground">{data.name}</p>
        {data.pronouns && <p className="text-sm text-muted">{data.pronouns}</p>}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-5 gap-2">
        <Stat label={t("evasion")} value={evasion} />
        <Stat label={t("hp")} value={classDef.hp} />
        <Stat label={t("stress")} value={6} />
        <Stat label={t("hope")} value={2} />
        <Stat label={t("proficiency")} value={1} />
      </div>

      {/* Details */}
      <div className="rounded-2xl border border-border bg-surface-2/20 px-4">
        <Row label={t("class")} value={tg(`dh.class.${data.classKey}`)} />
        {subDef && <Row label={t("subclass")} value={tg(`dh.subclass.${subDef.key}`)} />}
        {data.ancestryKey && <Row label={t("ancestry")} value={tg(`dh.ancestry.${data.ancestryKey}`)} />}
        {data.communityKey && <Row label={t("community")} value={tg(`dh.community.${data.communityKey}`)} />}
        {weapon && <Row label={t("weapon")} value={`${weapon.name} (${weapon.damage})`} />}
        {armor && <Row label={t("armor")} value={`${armor.name} (score ${armor.score})`} />}
      </div>

      {/* Traits */}
      <div className="rounded-2xl border border-border bg-surface-2/20 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{t("traits")}</p>
        <div className="grid grid-cols-3 gap-1.5">
          {(Object.entries(data.traits) as [string, number | null][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gold">{val !== null ? (val > 0 ? `+${val}` : val) : "·"}</span>
              <span className="text-xs text-muted capitalize">{tg(`dh.trait.${key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Domain cards */}
      {cards.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-2/20 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{t("cards")}</p>
          <div className="flex flex-col gap-1">
            {cards.map((c) => (
              <p key={c.id} className="text-sm text-foreground">{tg(`dh.card.${c.id}`)}</p>
            ))}
          </div>
        </div>
      )}

      {/* Experiences */}
      {(data.exp1 || data.exp2) && (
        <div className="rounded-2xl border border-border bg-surface-2/20 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{t("experiences")}</p>
          {data.exp1 && <p className="text-sm text-foreground">+2 — {data.exp1}</p>}
          {data.exp2 && <p className="text-sm text-foreground">+2 — {data.exp2}</p>}
        </div>
      )}
    </div>
  );
}
