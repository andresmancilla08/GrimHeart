"use client";

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { PRIMARY_WEAPONS, SECONDARY_WEAPONS, ARMORS } from "@/lib/daggerheart/equipment";
import { SUBCLASS_DEFS } from "@/lib/daggerheart/classes";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

function WeaponRow({
  name, trait, range, damage, burden, dmgType, feature, requiresSpellcast, selected, disabled, onSelect, t,
}: {
  name: string; trait: string; range: string; damage: string;
  burden: "oneHanded" | "twoHanded"; dmgType: "phy" | "mag";
  feature?: string; requiresSpellcast?: boolean;
  selected: boolean; disabled: boolean;
  onSelect: () => void;
  t: (k: string) => string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`flex flex-col gap-1.5 rounded-xl border p-3.5 text-left transition active:scale-[0.99] ${
        selected
          ? "border-gold bg-gold/[0.07] shadow-[0_0_0_1px_rgba(217,164,65,0.3)]"
          : disabled
          ? "cursor-not-allowed border-border/30 opacity-35"
          : "border-border bg-surface-2/30 hover:border-border-strong"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-display text-sm font-semibold text-foreground">{name}</span>
        {selected && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-[#2a1d05]">✓</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded bg-surface px-1.5 py-0.5 text-muted capitalize">{trait}</span>
        <span className="rounded bg-surface px-1.5 py-0.5 text-muted">{range}</span>
        <span className="rounded bg-surface px-1.5 py-0.5 font-mono text-foreground/80">{damage}</span>
        <span className={`rounded px-1.5 py-0.5 ${dmgType === "mag" ? "bg-purple-900/30 text-purple-300" : "bg-stone-800/40 text-stone-300"}`}>
          {dmgType === "mag" ? t("wizard.equipment.magic") : t("wizard.equipment.physical")}
        </span>
        <span className="rounded bg-surface px-1.5 py-0.5 text-muted">
          {t(burden === "oneHanded" ? "wizard.equipment.oneHanded" : "wizard.equipment.twoHanded")}
        </span>
      </div>
      {feature && <p className="text-[11px] italic text-muted/80">{feature}</p>}
      {requiresSpellcast && (
        <p className="text-[11px] text-fear-bright">{t("wizard.equipment.spellcastRequired")}</p>
      )}
    </button>
  );
}

export function StepEquipment({ data, onChange }: Props) {
  const { t } = useTranslation();
  const [section, setSection] = useState<"primary" | "secondary" | "armor">("primary");

  const hasSpellcast = data.subclassKey
    ? SUBCLASS_DEFS[data.subclassKey]?.spellcastTrait !== null
    : false;

  const selectedPrimary = PRIMARY_WEAPONS.find((w) => w.id === data.primaryWeaponId);
  const primaryIsOneHanded = selectedPrimary?.burden === "oneHanded";

  const rangeLabel = (r: string) => t(`dh.rangeLabel.${r}`);

  const sections: Array<{ key: "primary" | "secondary" | "armor"; label: string; disabled?: boolean }> = [
    { key: "primary", label: t("wizard.equipment.primaryLabel") },
    { key: "secondary", label: t("wizard.equipment.secondaryLabel"), disabled: !primaryIsOneHanded },
    { key: "armor", label: t("wizard.equipment.armorLabel") },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Section tabs */}
      <div className="flex rounded-xl border border-border bg-surface-2/30 p-1 gap-1">
        {sections.map((s) => (
          <button
            key={s.key}
            type="button"
            disabled={s.disabled}
            onClick={() => setSection(s.key)}
            className={`flex-1 rounded-lg py-2 text-xs font-medium transition ${
              section === s.key
                ? "bg-gold/10 text-gold"
                : s.disabled
                ? "cursor-not-allowed text-muted/30"
                : "text-muted hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Primary weapons */}
      {section === "primary" && (
        <div className="flex flex-col gap-2">
          {PRIMARY_WEAPONS.map((w) => (
            <WeaponRow
              key={w.id}
              {...w}
              range={rangeLabel(w.range)}
              selected={data.primaryWeaponId === w.id}
              disabled={!hasSpellcast && w.requiresSpellcast === true}
              onSelect={() => onChange({ primaryWeaponId: w.id, secondaryWeaponId: w.burden === "twoHanded" ? null : data.secondaryWeaponId })}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Secondary weapons */}
      {section === "secondary" && primaryIsOneHanded && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted">{t("wizard.equipment.secondaryHint")}</p>
          <button
            type="button"
            onClick={() => onChange({ secondaryWeaponId: null })}
            className={`rounded-xl border p-3.5 text-left text-sm transition ${
              data.secondaryWeaponId === null
                ? "border-gold bg-gold/[0.07]"
                : "border-border bg-surface-2/30"
            }`}
          >
            — {t("wizard.equipment.noArmor").replace("Sin Armadura", "None")} (skip)
          </button>
          {SECONDARY_WEAPONS.map((w) => (
            <WeaponRow
              key={w.id}
              {...w}
              range={rangeLabel(w.range)}
              selected={data.secondaryWeaponId === w.id}
              disabled={false}
              onSelect={() => onChange({ secondaryWeaponId: w.id })}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Armor */}
      {section === "armor" && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => onChange({ armorId: null })}
            className={`rounded-xl border p-3.5 text-left transition ${
              data.armorId === null
                ? "border-gold bg-gold/[0.07]"
                : "border-border bg-surface-2/30"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">{t("wizard.equipment.noArmor")}</p>
            <p className="mt-1 text-xs text-muted">Requires the Bare Bones card (Valor domain)</p>
          </button>
          {ARMORS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onChange({ armorId: a.id })}
              className={`flex flex-col gap-1.5 rounded-xl border p-3.5 text-left transition active:scale-[0.99] ${
                data.armorId === a.id
                  ? "border-gold bg-gold/[0.07] shadow-[0_0_0_1px_rgba(217,164,65,0.3)]"
                  : "border-border bg-surface-2/30 hover:border-border-strong"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-foreground">{a.name}</span>
                {data.armorId === a.id && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-[#2a1d05]">✓</span>
                )}
              </div>
              <div className="flex gap-2 text-[11px]">
                <span className="text-muted">{t("wizard.equipment.score")} {a.score}</span>
                <span className="text-muted">{t("wizard.equipment.thresholds")} {a.minorThreshold}/{a.severeThreshold}</span>
              </div>
              {a.feature && <p className="text-[11px] italic text-muted/80">{a.feature}</p>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
