"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PRIMARY_WEAPONS, SECONDARY_WEAPONS, ARMORS } from "@/lib/daggerheart/equipment";
import { SUBCLASS_DEFS } from "@/lib/daggerheart/classes";
import type { WeaponDef, ArmorDef, WeaponRange } from "@/lib/daggerheart/equipment";
import type { TraitKey } from "@/lib/daggerheart/types";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

// ── Design tokens ─────────────────────────────────────────────────────────────

const TRAIT_BADGE: Record<TraitKey, string> = {
  agility:   "border-cyan-500/40 bg-cyan-950/50 text-cyan-300",
  strength:  "border-amber-500/40 bg-amber-950/50 text-amber-300",
  finesse:   "border-violet-500/40 bg-violet-950/50 text-violet-300",
  instinct:  "border-emerald-500/40 bg-emerald-950/50 text-emerald-300",
  presence:  "border-pink-500/40 bg-pink-950/50 text-pink-300",
  knowledge: "border-blue-500/40 bg-blue-950/50 text-blue-300",
};

const RANGE_ICON: Record<WeaponRange, string> = {
  melee:    "⚔",
  veryClose:"↕",
  close:    "◎",
  far:      "◈",
  veryFar:  "◈◈",
};

const SECTION_ICON = { primary: "⚔", secondary: "✦", armor: "⬡" } as const;

const SELECTED_SHADOW = "shadow-[0_0_0_1px_rgba(217,164,65,0.25),0_8px_24px_-8px_rgba(217,164,65,0.35)]";
const SELECTED_CLASSES = `border-gold/60 bg-gold/[0.06] ${SELECTED_SHADOW}`;
const DEFAULT_CLASSES   = "border-border bg-surface-2/30 hover:border-border-strong";
const DISABLED_CLASSES  = "cursor-not-allowed border-border/20 opacity-30";

// ── Sub-components ─────────────────────────────────────────────────────────────

function SelectedMark() {
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold shadow-[0_0_10px_rgba(217,164,65,0.55)]">
      <span className="text-[9px] font-bold text-[#2a1d05]">✓</span>
    </span>
  );
}

function WeaponCard({
  weapon, selected, disabled, onSelect, index,
}: {
  weapon: WeaponDef; selected: boolean; disabled: boolean;
  onSelect: () => void; index: number;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      style={{ animationDelay: `${index * 30}ms` }}
      className={[
        "dh-rise flex flex-col gap-2.5 rounded-2xl border p-4 text-left",
        "transition-all duration-150",
        "active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        selected ? SELECTED_CLASSES : disabled ? DISABLED_CLASSES : DEFAULT_CLASSES,
      ].join(" ")}
    >
      {/* Row 1: name + damage die */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {selected && <SelectedMark />}
          <span className="font-display text-sm font-semibold leading-snug text-foreground truncate">
            {weapon.name}
          </span>
        </div>
        <span className="shrink-0 rounded-lg border border-gold/30 bg-gold/[0.08] px-2.5 py-1 font-mono text-sm font-bold tabular-nums text-gold">
          {weapon.damage}
        </span>
      </div>

      {/* Row 2: stat badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${TRAIT_BADGE[weapon.trait]}`}>
          {t(`dh.trait.${weapon.trait}`)}
        </span>
        <span className="rounded-md border border-stone-600/35 bg-stone-900/40 px-2 py-0.5 text-[10px] text-stone-300">
          {RANGE_ICON[weapon.range]} {t(`dh.rangeShort.${weapon.range}`)}
        </span>
        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${
          weapon.dmgType === "mag"
            ? "border-violet-500/40 bg-violet-950/50 text-violet-300"
            : "border-stone-500/30 bg-stone-900/30 text-stone-400"
        }`}>
          {weapon.dmgType === "mag" ? "✦ " : "⚔ "}
          {t(weapon.dmgType === "mag" ? "wizard.equipment.magic" : "wizard.equipment.physical")}
        </span>
        <span className="rounded-md border border-border/60 bg-surface/40 px-2 py-0.5 text-[10px] text-muted">
          {t(weapon.burden === "oneHanded" ? "wizard.equipment.oneHandedShort" : "wizard.equipment.twoHandedShort")}
        </span>
      </div>

      {/* Row 3: feature */}
      {weapon.feature && (
        <p className="text-[11px] leading-snug text-gold/55">★ {weapon.feature}</p>
      )}

      {/* Row 4: spellcast warning */}
      {weapon.requiresSpellcast && (
        <p className="text-[11px] text-fear-bright">✦ {t("wizard.equipment.spellcastRequired")}</p>
      )}
    </button>
  );
}

function ArmorCard({
  armor, selected, onSelect, index,
}: {
  armor: ArmorDef; selected: boolean; onSelect: () => void; index: number;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={{ animationDelay: `${index * 30}ms` }}
      className={[
        "dh-rise flex flex-col gap-2.5 rounded-2xl border p-4 text-left",
        "transition-all duration-150",
        "active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        selected ? SELECTED_CLASSES : DEFAULT_CLASSES,
      ].join(" ")}
    >
      {/* Row 1: name + score */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 pt-1">
          {selected && <SelectedMark />}
          <span className="font-display text-sm font-semibold leading-snug text-foreground">
            {armor.name}
          </span>
        </div>
        {/* Score badge */}
        <div className="flex shrink-0 flex-col items-center rounded-xl border border-gold/30 bg-gold/[0.08] px-3 py-1.5">
          <span className="font-mono text-xl font-bold leading-none text-gold">{armor.score}</span>
          <span className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-gold/60">
            {t("wizard.equipment.score")}
          </span>
        </div>
      </div>

      {/* Row 2: damage thresholds */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-muted">{t("wizard.equipment.thresholds")}</span>
        <div className="flex gap-1.5">
          <span className="rounded-md border border-amber-500/40 bg-amber-950/50 px-2 py-0.5 text-[10px] font-bold text-amber-300">
            {armor.minorThreshold} {t("wizard.equipment.minor")}
          </span>
          <span className="rounded-md border border-red-500/40 bg-red-950/50 px-2 py-0.5 text-[10px] font-bold text-red-300">
            {armor.severeThreshold} {t("wizard.equipment.severe")}
          </span>
        </div>
      </div>

      {/* Row 3: feature */}
      {armor.feature && (
        <p className="text-[11px] leading-snug text-gold/55">★ {armor.feature}</p>
      )}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function StepEquipment({ data, onChange }: Props) {
  const { t } = useTranslation();
  const [section, setSection] = useState<"primary" | "secondary" | "armor">("primary");

  const hasSpellcast = data.subclassKey
    ? SUBCLASS_DEFS[data.subclassKey]?.spellcastTrait !== null
    : false;

  const selectedPrimary = PRIMARY_WEAPONS.find((w) => w.id === data.primaryWeaponId);
  const primaryIsOneHanded = selectedPrimary?.burden === "oneHanded";

  const sections = [
    { key: "primary"   as const, label: t("wizard.equipment.primaryShort"),   icon: SECTION_ICON.primary,   disabled: false },
    { key: "secondary" as const, label: t("wizard.equipment.secondaryShort"),  icon: SECTION_ICON.secondary, disabled: !primaryIsOneHanded },
    { key: "armor"     as const, label: t("wizard.equipment.armorLabel"),      icon: SECTION_ICON.armor,     disabled: false },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── Tab switcher ─────────────────────────────────────────────────── */}
      <div className="flex gap-1 rounded-2xl border border-border bg-surface-2/30 p-1.5">
        {sections.map((s) => (
          <button
            key={s.key}
            type="button"
            disabled={s.disabled}
            onClick={() => !s.disabled && setSection(s.key)}
            className={[
              "relative flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2",
              "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
              section === s.key
                ? "bg-gold/[0.08] text-gold"
                : s.disabled
                ? "cursor-not-allowed text-muted/25"
                : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            <span className="text-base leading-none" aria-hidden>{s.icon}</span>
            <span className="text-[10px] font-medium leading-none">{s.label}</span>
            {section === s.key && (
              <span className="absolute bottom-1.5 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-gold" />
            )}
          </button>
        ))}
      </div>

      {/* ── Primary weapons ───────────────────────────────────────────────── */}
      {section === "primary" && (
        <div className="flex flex-col gap-2">
          {PRIMARY_WEAPONS.map((w, i) => (
            <WeaponCard
              key={w.id}
              weapon={w}
              index={i}
              selected={data.primaryWeaponId === w.id}
              disabled={!hasSpellcast && w.requiresSpellcast === true}
              onSelect={() => onChange({
                primaryWeaponId: w.id,
                secondaryWeaponId: w.burden === "twoHanded" ? null : data.secondaryWeaponId,
              })}
            />
          ))}
        </div>
      )}

      {/* ── Secondary weapons ─────────────────────────────────────────────── */}
      {section === "secondary" && primaryIsOneHanded && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted">{t("wizard.equipment.secondaryHint")}</p>
          {/* "None" option */}
          <button
            type="button"
            onClick={() => onChange({ secondaryWeaponId: null })}
            aria-pressed={data.secondaryWeaponId === null}
            className={[
              "dh-rise rounded-2xl border py-4 text-center text-sm font-medium",
              "transition-all duration-150 active:scale-[0.985]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
              data.secondaryWeaponId === null
                ? `${SELECTED_CLASSES} text-gold`
                : "border-border/50 border-dashed text-muted hover:border-border-strong hover:text-foreground",
            ].join(" ")}
          >
            {data.secondaryWeaponId === null && "✓ "}
            {t("wizard.equipment.noSecondary")}
          </button>
          {SECONDARY_WEAPONS.map((w, i) => (
            <WeaponCard
              key={w.id}
              weapon={w}
              index={i + 1}
              selected={data.secondaryWeaponId === w.id}
              disabled={false}
              onSelect={() => onChange({ secondaryWeaponId: w.id })}
            />
          ))}
        </div>
      )}

      {/* ── Armor ─────────────────────────────────────────────────────────── */}
      {section === "armor" && (
        <div className="flex flex-col gap-2">
          {/* "No armor" option */}
          <button
            type="button"
            onClick={() => onChange({ armorId: null })}
            aria-pressed={data.armorId === null}
            className={[
              "dh-rise rounded-2xl border px-4 py-4 text-center",
              "transition-all duration-150 active:scale-[0.985]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
              data.armorId === null
                ? SELECTED_CLASSES
                : "border-border/50 border-dashed bg-transparent hover:border-border-strong",
            ].join(" ")}
          >
            <p className={`text-sm font-semibold ${data.armorId === null ? "text-gold" : "text-muted"}`}>
              {data.armorId === null && "✓ "}
              {t("wizard.equipment.noArmor")}
            </p>
            <p className="mt-1 text-xs text-muted">{t("wizard.equipment.noArmorHint")}</p>
          </button>

          {ARMORS.map((a, i) => (
            <ArmorCard
              key={a.id}
              armor={a}
              index={i + 1}
              selected={data.armorId === a.id}
              onSelect={() => onChange({ armorId: a.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
