"use client";

import { useTranslation } from "react-i18next";
import { cardsForDomains } from "@/lib/daggerheart/cards";
import { CLASS_DEFS } from "@/lib/daggerheart/classes";
import type { ClassKey } from "@/lib/daggerheart/types";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

const domainColors: Record<string, { bg: string; text: string; border: string }> = {
  arcana:   { bg: "bg-purple-900/20",  text: "text-purple-300",  border: "border-purple-500/30" },
  blade:    { bg: "bg-red-900/20",     text: "text-red-300",     border: "border-red-500/30" },
  bone:     { bg: "bg-stone-800/30",   text: "text-stone-300",   border: "border-stone-500/30" },
  codex:    { bg: "bg-blue-900/20",    text: "text-blue-300",    border: "border-blue-500/30" },
  grace:    { bg: "bg-pink-900/20",    text: "text-pink-300",    border: "border-pink-500/30" },
  midnight: { bg: "bg-indigo-900/20",  text: "text-indigo-300",  border: "border-indigo-500/30" },
  sage:     { bg: "bg-green-900/20",   text: "text-green-300",   border: "border-green-500/30" },
  splendor: { bg: "bg-gold/10",        text: "text-gold",        border: "border-gold/30" },
  valor:    { bg: "bg-amber-900/20",   text: "text-amber-300",   border: "border-amber-500/30" },
};

const typeColors: Record<string, string> = {
  ability:  "text-blue-300 bg-blue-900/30",
  spell:    "text-purple-300 bg-purple-900/30",
  grimoire: "text-gold bg-gold/10",
};

export function StepDomainCards({ data, onChange }: Props) {
  const { t } = useTranslation();

  if (!data.classKey) return null;
  const classDef = CLASS_DEFS[data.classKey as ClassKey];
  const cards = cardsForDomains(classDef.domains, 1);
  const selected = data.domainCardIds;

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange({ domainCardIds: selected.filter((s) => s !== id) });
    } else if (selected.length < 2) {
      onChange({ domainCardIds: [...selected, id] });
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{t("wizard.cards.subtitle")}</p>
        <span className={`text-sm font-bold ${selected.length === 2 ? "text-gold" : "text-muted"}`}>
          {t("wizard.cards.selected", { count: selected.length })}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {cards.map((card) => {
          const isSelected = selected.includes(card.id);
          const isDisabled = !isSelected && selected.length >= 2;
          const dc = domainColors[card.domain] ?? { bg: "bg-surface-2", text: "text-muted", border: "border-border" };
          const nameKey = `dh.card.${card.id}`;
          const descKey = `dh.card.${card.id}_desc`;

          return (
            <button
              key={card.id}
              type="button"
              disabled={isDisabled}
              onClick={() => toggle(card.id)}
              className={`flex flex-col gap-2 rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                isSelected
                  ? `${dc.border} ${dc.bg} shadow-[0_0_0_1px_rgba(217,164,65,0.25)]`
                  : isDisabled
                  ? "cursor-not-allowed border-border/30 opacity-40"
                  : `border-border bg-surface-2/30 hover:border-border-strong`
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${dc.bg} ${dc.text}`}>
                    {t(`dh.domain.${card.domain}`)}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-medium ${typeColors[card.type] ?? "text-muted bg-surface"}`}>
                    {t(`wizard.cards.${card.type}`)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted">
                    {t("wizard.cards.recallCost", { cost: card.recallCost })}
                  </span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-[#2a1d05]">
                      ✓
                    </span>
                  )}
                </div>
              </div>
              <p className="font-display text-sm font-semibold text-foreground">{t(nameKey)}</p>
              <p className="text-xs leading-relaxed text-muted">{t(descKey)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
