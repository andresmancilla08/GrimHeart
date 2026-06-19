"use client";

import { useTranslation } from "react-i18next";
import { CLASSES } from "@/lib/daggerheart/reference";
import { CLASS_DEFS, SUBCLASS_DEFS } from "@/lib/daggerheart/classes";
import { SelectionCard } from "./SelectionCard";
import type { WizardData } from "./types";
import type { ClassKey } from "@/lib/daggerheart/types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

export function StepClass({ data, onChange }: Props) {
  const { t } = useTranslation();

  const domainColors: Record<string, string> = {
    arcana: "text-purple-300 bg-purple-900/30",
    blade: "text-red-300 bg-red-900/30",
    bone: "text-stone-300 bg-stone-800/40",
    codex: "text-blue-300 bg-blue-900/30",
    grace: "text-pink-300 bg-pink-900/30",
    midnight: "text-indigo-300 bg-indigo-900/30",
    sage: "text-green-300 bg-green-900/30",
    splendor: "text-gold bg-gold/10",
    valor: "text-amber-300 bg-amber-900/30",
  };

  const selectedClass = data.classKey ? CLASS_DEFS[data.classKey] : null;
  const subclasses = selectedClass
    ? selectedClass.subclasses.map((sk) => SUBCLASS_DEFS[sk])
    : [];

  return (
    <div className="flex flex-col gap-6">
      {/* Class grid */}
      <div>
        <p className="mb-3 text-sm font-semibold text-foreground/70 uppercase tracking-wider">
          {t("wizard.class.title")}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CLASSES.map((key) => {
            const def = CLASS_DEFS[key];
            return (
              <SelectionCard
                key={key}
                selected={data.classKey === key}
                onClick={() => onChange({ classKey: key as ClassKey, subclassKey: null, domainCardIds: [] })}
                title={t(`dh.class.${key}`)}
                description={t(`dh.class.${key}_desc`)}
              >
                <div className="mt-1 flex flex-wrap gap-1">
                  {def.domains.map((d) => (
                    <span
                      key={d}
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${domainColors[d] ?? "text-muted bg-surface"}`}
                    >
                      {t(`dh.domain.${d}`)}
                    </span>
                  ))}
                </div>
                <div className="mt-1 flex gap-3 text-[11px] text-muted">
                  <span>{t("wizard.class.evasion")} {def.evasion}</span>
                  <span>{t("wizard.class.hp")} {def.hp}</span>
                </div>
              </SelectionCard>
            );
          })}
        </div>
      </div>

      {/* Subclass selection — appears once a class is chosen */}
      {selectedClass && (
        <div className="dh-rise">
          <p className="mb-3 text-sm font-semibold text-foreground/70 uppercase tracking-wider">
            {t("wizard.class.subclassTitle")}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {subclasses.map((sub) => (
              <SelectionCard
                key={sub.key}
                selected={data.subclassKey === sub.key}
                onClick={() => onChange({ subclassKey: sub.key })}
                title={t(`dh.subclass.${sub.key}`)}
                description={t(`dh.subclass.${sub.key}_desc`)}
              >
                {sub.spellcastTrait && (
                  <span className="mt-1 text-[11px] text-fear-bright">
                    {t("wizard.class.spellcast", { trait: t(`dh.trait.${sub.spellcastTrait}`) })}
                  </span>
                )}
              </SelectionCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
