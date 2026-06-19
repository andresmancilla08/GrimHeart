"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { Character, TraitKey } from "@/lib/daggerheart/types";
import { CARDS_BY_ID } from "@/lib/daggerheart/cards";
import { WEAPONS_BY_ID, ARMOR_BY_ID } from "@/lib/daggerheart/equipment";

// NOTA: boostedTraits ya existe en Character; cast defensivo por si otro agente lo modifica
interface Props {
  character: Character;
}

export function CharacterSheetClient({ character: c }: Props) {
  const { t } = useTranslation();

  const weapons = c.equipment.weapons.map((w) => WEAPONS_BY_ID[w.id]).filter(Boolean);
  const armor = c.equipment.armorId ? ARMOR_BY_ID[c.equipment.armorId] : null;
  const cards = c.loadout.map((id) => CARDS_BY_ID[id]).filter(Boolean);
  const boostedTraits: TraitKey[] = (c as Character & { boostedTraits?: TraitKey[] }).boostedTraits ?? [];

  const traits = Object.entries(c.traits) as [TraitKey, number][];

  return (
    <div className="dh-rise flex flex-col gap-5 px-5">
      {/* ── Banner de clase ── */}
      <div className="relative -mx-5 h-52 overflow-hidden">
        <Image
          src={`/art/${c.classKey}.jpg`}
          alt=""
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "top center",
            filter: "brightness(0.55) saturate(1.15)",
          }}
        />
        {/* Gradiente de legibilidad */}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#0c0a12] to-transparent" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0c0a12]/60 to-transparent" />

        {/* Nombre y clase sobre el banner */}
        <div className="absolute bottom-6 left-5 right-20">
          <h1 className="font-display text-3xl font-bold text-white drop-shadow-lg leading-tight line-clamp-2">
            {c.name}
          </h1>
          {c.pronouns && (
            <p className="text-xs text-white/50 mt-0.5">{c.pronouns}</p>
          )}
          <p className="text-sm text-gold/80 mt-1">
            {t(`dh.class.${c.classKey}`)} · {t("characters.level", { level: c.level })}
          </p>
        </div>

        {/* Badge de nivel */}
        <div className="absolute right-5 bottom-6 flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-[#0c0a12]/70 backdrop-blur-sm">
          <span className="font-display text-xl font-bold text-gold leading-none">{c.level}</span>
        </div>
      </div>

      {/* Content sections — extra bottom padding for fixed level-up CTA */}
      <div className="flex flex-col gap-5 pb-44">
        {/* ── Stats ── */}
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: t("wizard.review.evasion"), value: c.evasion },
            { label: t("wizard.review.hp"), value: c.hpMax },
            { label: t("wizard.review.stress"), value: c.stressMax },
            { label: t("wizard.review.hope"), value: c.hope },
            { label: t("wizard.review.proficiency"), value: c.proficiency },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1 rounded-xl border border-gold/20 bg-gold/[0.04] p-3"
            >
              <span className="font-display text-2xl font-bold text-gold drop-shadow-[0_0_8px_rgba(217,164,65,0.4)]">
                {value}
              </span>
              <span className="text-center text-[10px] text-muted leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Heritage ── */}
        <div className="rounded-2xl border border-border/60 bg-surface-2/20 px-4">
          {[
            [t("wizard.review.ancestry"), t(`dh.ancestry.${c.ancestryKey}`)],
            [t("wizard.review.community"), t(`dh.community.${c.communityKey}`)],
            [t("wizard.review.subclass"), t(`dh.subclass.${c.subclassKey}`)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-baseline justify-between gap-2 border-b border-border/40 py-3 last:border-0"
            >
              <span className="text-xs text-muted">{label}</span>
              <span className="text-sm font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>

        {/* ── Traits ── */}
        <div className="rounded-2xl border border-border/60 bg-surface-2/20 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            {t("wizard.review.traits")}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {traits.map(([key, val]) => {
              const boosted = boostedTraits.includes(key);
              return (
                <div key={key} className="flex items-center gap-2.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-bold text-sm ${
                      val > 0
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : val < 0
                        ? "border-rose-500/30 bg-rose-500/10 text-rose-400"
                        : "border-border/60 bg-surface-2/40 text-muted"
                    }`}
                  >
                    {val > 0 ? `+${val}` : val}
                  </span>
                  <div className="min-w-0">
                    <span className="block text-sm text-foreground capitalize leading-tight">
                      {t(`dh.trait.${key}`)}
                    </span>
                    {boosted && (
                      <span className="text-[10px] text-gold/60">
                        {t("levelUp.boostedLabel")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Domain Cards ── */}
        {cards.length > 0 && (
          <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              {t("wizard.review.cards")}
            </p>
            <div className="flex flex-col gap-3">
              {cards.map((card) => (
                <div key={card.id} className="overflow-hidden rounded-xl border border-border/60">
                  <div className="relative h-20 w-full">
                    <Image
                      src={`/art/cards/${card.id}.jpg`}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      style={{
                        objectFit: "cover",
                        objectPosition: "center 20%",
                        filter: "brightness(0.75) saturate(1.1)",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface-2 to-transparent" />
                  </div>
                  <div className="px-3 pb-3 pt-2">
                    <p className="font-display text-sm font-semibold text-foreground">
                      {t(`dh.card.${card.id}`)}
                    </p>
                    <p className="mt-1 text-xs text-muted">{t(`dh.card.${card.id}_desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Equipment ── */}
        {(weapons.length > 0 || armor) && (
          <div className="rounded-2xl border border-border/60 bg-surface-2/50 px-4">
            {weapons.map((weapon) => (
              <div
                key={weapon.id}
                className="flex items-baseline justify-between gap-2 border-b border-border/40 py-3 last:border-0"
              >
                <span className="text-xs text-muted">{t("wizard.review.weapon")}</span>
                <span className="text-sm font-medium text-foreground">
                  {weapon.name}{" "}
                  <span className="text-muted">({weapon.damage})</span>
                </span>
              </div>
            ))}
            {armor && (
              <div className="flex items-baseline justify-between gap-2 py-3">
                <span className="text-xs text-muted">{t("wizard.review.armor")}</span>
                <span className="text-sm font-medium text-foreground">{armor.name}</span>
              </div>
            )}
          </div>
        )}

        {/* ── Experiences ── */}
        {c.experiences.length > 0 && (
          <div className="rounded-2xl border border-border/60 bg-surface-2/20 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              {t("wizard.review.experiences")}
            </p>
            <div className="flex flex-col gap-1.5">
              {c.experiences.map((exp) => (
                <div key={exp.id} className="flex items-center gap-2">
                  <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-xs font-bold text-gold">
                    +{exp.modifier}
                  </span>
                  <span className="text-sm text-foreground">{exp.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
