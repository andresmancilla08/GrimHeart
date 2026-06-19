"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import type { Character } from "@/lib/daggerheart/types";
import { CARDS_BY_ID } from "@/lib/daggerheart/cards";
import { WEAPONS_BY_ID, ARMOR_BY_ID } from "@/lib/daggerheart/equipment";

export function CharacterSheetClient({ character: c }: { character: Character }) {
  const { t } = useTranslation();

  const weapon = c.equipment.weapons[0] ? WEAPONS_BY_ID[c.equipment.weapons[0].id] : null;
  const armor = c.equipment.armorId ? ARMOR_BY_ID[c.equipment.armorId] : null;
  const cards = c.loadout.map((id) => CARDS_BY_ID[id]).filter(Boolean);

  const traits = Object.entries(c.traits) as [string, number][];

  return (
    <div className="dh-rise flex flex-col gap-4 px-5 py-6">
      {/* Back */}
      <Link href="/characters" className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition">
        ← {t("characters.title")}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-2xl font-bold text-gold">
          {c.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">{c.name}</h1>
          {c.pronouns && <p className="text-sm text-muted">{c.pronouns}</p>}
          <p className="text-sm text-muted">
            {t(`dh.class.${c.classKey}`)} · {t("characters.level", { level: c.level })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { label: t("wizard.review.evasion"), value: c.evasion },
          { label: t("wizard.review.hp"), value: c.hpMax },
          { label: t("wizard.review.stress"), value: c.stressMax },
          { label: t("wizard.review.hope"), value: c.hope },
          { label: t("wizard.review.proficiency"), value: c.proficiency },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-surface-2/30 p-3">
            <span className="font-display text-xl font-bold text-gold">{value}</span>
            <span className="text-center text-[10px] text-muted leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Heritage */}
      <div className="rounded-2xl border border-border bg-surface-2/20 px-4">
        {[
          [t("wizard.review.ancestry"), t(`dh.ancestry.${c.ancestryKey}`)],
          [t("wizard.review.community"), t(`dh.community.${c.communityKey}`)],
          [t("wizard.review.subclass"), t(`dh.subclass.${c.subclassKey}`)],
        ].map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-2 border-b border-border/40 py-2 last:border-0">
            <span className="text-xs text-muted">{label}</span>
            <span className="text-sm font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>

      {/* Traits */}
      <div className="rounded-2xl border border-border bg-surface-2/20 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{t("wizard.review.traits")}</p>
        <div className="grid grid-cols-2 gap-2">
          {traits.map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-gold/5 font-bold text-sm text-gold">
                {val > 0 ? `+${val}` : val}
              </span>
              <span className="text-sm text-foreground capitalize">{t(`dh.trait.${key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Domain cards */}
      {cards.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-2/20 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{t("wizard.review.cards")}</p>
          <div className="flex flex-col gap-3">
            {cards.map((card) => (
              <div key={card.id} className="rounded-xl border border-border/60 p-3">
                <p className="font-display text-sm font-semibold text-foreground">{t(`dh.card.${card.id}`)}</p>
                <p className="mt-1 text-xs text-muted">{t(`dh.card.${card.id}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment */}
      <div className="rounded-2xl border border-border bg-surface-2/20 px-4">
        {weapon && (
          <div className="flex items-baseline justify-between gap-2 border-b border-border/40 py-2">
            <span className="text-xs text-muted">{t("wizard.review.weapon")}</span>
            <span className="text-sm font-medium text-foreground">{weapon.name} ({weapon.damage})</span>
          </div>
        )}
        {armor && (
          <div className="flex items-baseline justify-between gap-2 py-2">
            <span className="text-xs text-muted">{t("wizard.review.armor")}</span>
            <span className="text-sm font-medium text-foreground">{armor.name}</span>
          </div>
        )}
      </div>

      {/* Experiences */}
      {c.experiences.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-2/20 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{t("wizard.review.experiences")}</p>
          {c.experiences.map((exp) => (
            <p key={exp.id} className="text-sm text-foreground">+{exp.modifier} — {exp.name}</p>
          ))}
        </div>
      )}
    </div>
  );
}
