"use client";

import { useTranslation } from "react-i18next";
import { TRAITS, TRAIT_ARRAY } from "@/lib/daggerheart/reference";
import type { TraitKey } from "@/lib/daggerheart/types";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

function modifierLabel(v: number) {
  return v > 0 ? `+${v}` : `${v}`;
}

export function StepTraits({ data, onChange }: Props) {
  const { t } = useTranslation();

  // Pool: list of [+2,+1,+1,0,0,-1] minus already assigned values
  const pool = [...TRAIT_ARRAY] as number[];
  for (const val of Object.values(data.traits)) {
    if (val !== null) {
      const idx = pool.indexOf(val);
      if (idx !== -1) pool.splice(idx, 1);
    }
  }

  function handlePoolChip(value: number) {
    if (data.pendingModifier === value) {
      onChange({ pendingModifier: null });
    } else {
      onChange({ pendingModifier: value });
    }
  }

  function handleTrait(key: TraitKey) {
    const current = data.traits[key];
    if (data.pendingModifier !== null) {
      // Assign pending to this trait, return current to pool
      const newTraits = { ...data.traits, [key]: data.pendingModifier };
      onChange({ traits: newTraits, pendingModifier: null });
    } else if (current !== null) {
      // Unassign
      onChange({ traits: { ...data.traits, [key]: null } });
    }
  }

  const allAssigned = pool.length === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Modifier pool */}
      <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
          {t("wizard.traits.pool")}
        </p>
        <div className="flex flex-wrap gap-2">
          {TRAIT_ARRAY.map((val, i) => {
            const inPool = pool.indexOf(val) !== -1 && pool.filter((v) => v === val).length > (pool.filter((v) => v === val).length - pool.filter((v) => v === val).length);
            const isPoolItem = pool.includes(val) && (() => {
              const tmp = [...TRAIT_ARRAY] as number[];
              for (const tv of Object.values(data.traits)) {
                if (tv !== null) {
                  const idx = tmp.indexOf(tv);
                  if (idx !== -1) tmp.splice(idx, 1);
                }
              }
              return tmp.some((v) => v === val);
            })();
            const isPending = data.pendingModifier === val && isPoolItem;
            // Each chip is shown — if assigned it's dim, if in pool it's tappable
            const assigned = !isPoolItem;
            return (
              <button
                key={i}
                type="button"
                disabled={assigned}
                onClick={() => !assigned && handlePoolChip(val)}
                className={`min-w-[3rem] rounded-full border px-4 py-2 text-sm font-bold transition active:scale-95 ${
                  assigned
                    ? "cursor-not-allowed border-border/30 text-muted/30"
                    : isPending
                    ? "border-gold bg-gold text-[#2a1d05] shadow-[0_0_12px_rgba(217,164,65,0.5)]"
                    : "border-border-strong bg-surface-2 text-foreground hover:border-gold/60"
                }`}
              >
                {modifierLabel(val)}
              </button>
            );
          })}
        </div>
        {data.pendingModifier !== null && (
          <p className="mt-2 text-xs text-gold/80">
            {modifierLabel(data.pendingModifier)} — tap a trait to assign
          </p>
        )}
      </div>

      {/* Trait rows */}
      <div className="flex flex-col gap-2">
        {TRAITS.map((key) => {
          const val = data.traits[key];
          const isTarget = data.pendingModifier !== null;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleTrait(key)}
              className={`flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition active:scale-[0.99] ${
                isTarget
                  ? "border-gold/50 bg-gold/[0.04] hover:bg-gold/[0.08]"
                  : val !== null
                  ? "border-border-strong bg-surface-2/50"
                  : "border-border bg-surface-2/30"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface font-display text-sm font-bold text-gold">
                {val !== null ? modifierLabel(val) : "·"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t(`dh.trait.${key}`)}</p>
                <p className="text-xs text-muted">{t(`dh.trait.${key}_verbs`)}</p>
              </div>
              {val !== null && (
                <span className="text-xs text-muted/60">tap to remove</span>
              )}
            </button>
          );
        })}
      </div>

      {allAssigned && (
        <p className="text-center text-xs text-gold/70">{t("wizard.traits.allAssigned")} ✓</p>
      )}
    </div>
  );
}
