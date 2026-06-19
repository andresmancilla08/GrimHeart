"use client";

import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { TRAIT_ARRAY } from "@/lib/daggerheart/reference";
import { createCharacter } from "@/lib/characters/actions";
import type { CreateCharacterInput } from "@/lib/characters/actions";
import type { CharacterTraits, TraitKey } from "@/lib/daggerheart/types";
import { INITIAL_DATA, STEP_KEYS, type WizardData } from "./types";
import { StepIdentity } from "./StepIdentity";
import { StepClass } from "./StepClass";
import { StepHeritage } from "./StepHeritage";
import { StepTraits } from "./StepTraits";
import { StepDomainCards } from "./StepDomainCards";
import { StepEquipment } from "./StepEquipment";
import { StepBackground } from "./StepBackground";
import { StepReview } from "./StepReview";

export function CharacterWizard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function update(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  // Pool state for traits
  const assignedCount = Object.values(data.traits).filter((v) => v !== null).length;
  const allTraitsAssigned = assignedCount === 6;
  const traitPool = [...TRAIT_ARRAY] as number[];
  for (const val of Object.values(data.traits)) {
    if (val !== null) {
      const idx = traitPool.indexOf(val);
      if (idx !== -1) traitPool.splice(idx, 1);
    }
  }

  function canContinue() {
    switch (step) {
      case 0: return data.name.trim().length >= 1;
      case 1: return data.classKey !== null && data.subclassKey !== null;
      case 2: return data.ancestryKey !== null && data.communityKey !== null;
      case 3: return allTraitsAssigned;
      case 4: return data.domainCardIds.length === 2;
      case 5: return data.primaryWeaponId !== null;
      case 6: return data.exp1.trim().length > 0 && data.exp2.trim().length > 0;
      case 7: return true;
      default: return false;
    }
  }

  function handleCreate() {
    if (!data.classKey || !data.subclassKey || !data.ancestryKey || !data.communityKey || !data.primaryWeaponId) return;

    const traits = Object.fromEntries(
      (Object.entries(data.traits) as [TraitKey, number | null][]).map(([k, v]) => [k, v ?? 0]),
    ) as unknown as CharacterTraits;

    const input: CreateCharacterInput = {
      name: data.name,
      pronouns: data.pronouns,
      classKey: data.classKey,
      subclassKey: data.subclassKey,
      ancestryKey: data.ancestryKey,
      communityKey: data.communityKey,
      traits,
      domainCardIds: data.domainCardIds,
      primaryWeaponId: data.primaryWeaponId,
      secondaryWeaponId: data.secondaryWeaponId,
      armorId: data.armorId,
      experiences: [data.exp1.trim(), data.exp2.trim()],
    };

    startTransition(async () => {
      setError(null);
      const result = await createCharacter(input);
      if ("error" in result) {
        setError(result.error);
      } else {
        router.push(`/characters/${result.id}`);
      }
    });
  }

  const stepKey = STEP_KEYS[step];
  const totalSteps = STEP_KEYS.length;

  const stepComponents: Record<typeof STEP_KEYS[number], React.ReactNode> = {
    identity:   <StepIdentity data={data} onChange={update} />,
    class:      <StepClass data={data} onChange={update} />,
    heritage:   <StepHeritage data={data} onChange={update} />,
    traits:     <StepTraits data={data} onChange={update} />,
    cards:      <StepDomainCards data={data} onChange={update} />,
    equipment:  <StepEquipment data={data} onChange={update} />,
    background: <StepBackground data={data} onChange={update} />,
    review:     <StepReview data={data} error={error ?? undefined} />,
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden overscroll-none">
      {/* Progress bar */}
      <div className="shrink-0 border-b border-border bg-surface/80 px-5 pb-3 pt-safe backdrop-blur-sm">
        <div className="flex items-center justify-between pb-2">
          <span className="font-display text-xs font-semibold uppercase tracking-widest text-gold/70">
            {t(`wizard.stepNames.${stepKey}`)}
          </span>
          <span className="text-xs text-muted">
            {t("wizard.progress", { current: step + 1, total: totalSteps })}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold to-gold-bright transition-all duration-300"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step title */}
      <div className="shrink-0 px-5 pb-2 pt-4">
        <h1 className="font-display text-xl font-semibold text-foreground">
          {t(`wizard.${stepKey}.title`)}
        </h1>
        <p className="mt-0.5 text-sm text-muted">{t(`wizard.${stepKey}.subtitle`)}</p>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-2">
        {stepComponents[stepKey]}
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 border-t border-border bg-surface/80 px-5 pb-safe pt-3 backdrop-blur-sm">
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="h-12 flex-1 rounded-full border border-border text-sm font-medium text-muted transition hover:border-border-strong hover:text-foreground active:scale-[0.99]"
            >
              {t("wizard.back")}
            </button>
          )}
          <button
            type="button"
            disabled={!canContinue() || isPending}
            onClick={() => {
              if (step === totalSteps - 1) {
                handleCreate();
              } else {
                setStep(step + 1);
              }
            }}
            className="h-12 flex-1 rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            {isPending
              ? t("wizard.creating")
              : step === totalSteps - 1
              ? t("wizard.create")
              : t("wizard.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
