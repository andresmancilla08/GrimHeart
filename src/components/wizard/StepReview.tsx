"use client";

import { useTranslation } from "react-i18next";
import { CLASS_DEFS, SUBCLASS_DEFS } from "@/lib/daggerheart/classes";
import { ARMOR_BY_ID, WEAPONS_BY_ID } from "@/lib/daggerheart/equipment";
import { CARDS_BY_ID } from "@/lib/daggerheart/cards";
import type { WizardData } from "./types";

// ── Starting values (Daggerheart level 1 constants) ───────────────────────────
const STARTING_STRESS      = 6;
const STARTING_HOPE        = 2;
const STARTING_PROFICIENCY = 1;

interface Props {
  data: WizardData;
  error?: string;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-border/40 py-2.5 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-border bg-surface-2/30 px-1 py-2.5">
      <span className="font-display text-lg font-bold tabular-nums leading-none text-gold drop-shadow-[0_0_8px_rgba(217,164,65,0.5)]">
        {value}
      </span>
      <span className="mt-0.5 w-full text-center text-[9px] uppercase leading-[1.2] tracking-wide text-muted/70">
        {label}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gold/50">
      {children}
    </p>
  );
}

export function StepReview({ data, error }: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: "wizard.review" });
  const { t: tg } = useTranslation();

  if (!data.classKey) return null;

  const classDef = CLASS_DEFS[data.classKey];
  const subDef   = data.subclassKey ? SUBCLASS_DEFS[data.subclassKey] : null;
  const armor    = data.armorId     ? ARMOR_BY_ID[data.armorId]       : null;
  const weapon   = data.primaryWeaponId ? WEAPONS_BY_ID[data.primaryWeaponId] : null;
  const cards    = data.domainCardIds.map((id) => CARDS_BY_ID[id]).filter(Boolean);

  // Derive evasion for display
  let evasion = classDef.evasion;
  if (armor?.featureKey === "flexible")  evasion += 1;
  if (armor?.featureKey === "heavy")     evasion -= 1;
  if (armor?.featureKey === "veryHeavy") evasion -= 2;
  if (weapon?.featureKey === "massive" || weapon?.featureKey === "heavy") evasion -= 1;

  return (
    <div className="dh-rise flex flex-col gap-5">
      {error && (
        <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {/* ── Hero: nombre del personaje ────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <h2
          className="font-display text-3xl font-bold tracking-wide text-gold-bright"
          style={{ textShadow: "0 1px 2px rgba(217,164,65,0.25), 0 0 20px rgba(217,164,65,0.18), 0 0 60px rgba(217,164,65,0.08)" }}
        >
          {data.name}
        </h2>
        {data.pronouns && (
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted/60">
            {data.pronouns}
          </p>
        )}
        {/* Separador dorado decorativo */}
        <div className="mt-2 h-px w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </div>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <div
        role="group"
        aria-label={t("statsGroup")}
        className="grid grid-cols-5 gap-1.5"
      >
        <Stat label={t("evasion")}     value={evasion} />
        <Stat label={t("hp")}          value={classDef.hp} />
        <Stat label={t("stress")}      value={STARTING_STRESS} />
        <Stat label={t("hope")}        value={STARTING_HOPE} />
        <Stat label={t("proficiency")} value={STARTING_PROFICIENCY} />
      </div>

      {/* ── Details: clase, raza, equipo (sección primaria) ──────────────── */}
      <div className="rounded-2xl border border-border bg-surface-2/50 px-4">
        <Row label={t("class")}     value={tg(`dh.class.${data.classKey}`)} />
        {subDef && (
          <Row label={t("subclass")} value={tg(`dh.subclass.${subDef.key}`)} />
        )}
        {data.ancestryKey && (
          <Row label={t("ancestry")} value={tg(`dh.ancestry.${data.ancestryKey}`)} />
        )}
        {data.communityKey && (
          <Row label={t("community")} value={tg(`dh.community.${data.communityKey}`)} />
        )}
        {weapon && (
          <Row label={t("weapon")} value={`${tg(`equip.${weapon.id}.name`)} (${weapon.damage})`} />
        )}
        <Row
          label={t("armor")}
          value={
            armor
              ? `${tg(`equip.${armor.id}.name`)} (${tg("wizard.equipment.score")} ${armor.score})`
              : tg("wizard.equipment.noArmor")
          }
        />
      </div>

      {/* ── Traits: color semántico por valor ────────────────────────────── */}
      <div className="rounded-2xl border border-border/60 bg-surface-2/20 p-4">
        <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-fear-bright/60">
          {t("traits")}
        </h3>
        <div className="grid grid-cols-3 gap-x-2 gap-y-2">
          {(Object.entries(data.traits) as [string, number | null][]).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className={[
                  "min-w-[24px] text-center text-xs font-bold",
                  val === null
                    ? "text-muted/40"
                    : val > 0
                    ? "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.35)]"
                    : val < 0
                    ? "text-rose-400"
                    : "text-muted/60",
                ].join(" ")}
              >
                {val !== null ? (val > 0 ? `+${val}` : val) : "·"}
              </span>
              <span className="text-xs text-muted">{tg(`dh.trait.${key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Domain cards ─────────────────────────────────────────────────── */}
      {cards.length > 0 && (
        <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-4">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-gold/60">
            {t("cards")}{" "}
            <span className="font-normal normal-case tracking-normal text-gold/40">
              ({cards.length})
            </span>
          </h3>
          <div className="flex flex-col gap-1.5">
            {cards.map((c) => (
              <p key={c.id} className="text-sm text-foreground">
                {tg(`dh.card.${c.id}`)}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── Experiences ──────────────────────────────────────────────────── */}
      {(data.exp1 || data.exp2) && (
        <div className="rounded-2xl border-l-2 border border-border/40 border-l-gold/35 bg-surface-2/10 p-4">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-muted/60">
            {t("experiences")}
          </h3>
          {data.exp1 && (
            <p className="text-sm italic text-foreground/80">
              {"+2 — "}{data.exp1}
            </p>
          )}
          {data.exp2 && (
            <p className="mt-1.5 text-sm italic text-foreground/80">
              {"+2 — "}{data.exp2}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
