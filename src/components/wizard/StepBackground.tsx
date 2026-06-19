"use client";

import { useTranslation } from "react-i18next";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

export function StepBackground({ data, onChange }: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: "wizard.background" });

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm leading-relaxed text-muted">{t("expHint")}</p>

      <div className="flex flex-col gap-3">
        {([["exp1", t("exp1"), t("exp1Placeholder")], ["exp2", t("exp2"), t("exp2Placeholder")]] as const).map(
          ([field, label, placeholder]) => (
            <div key={field} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/80">{label}</label>
              <div className="flex items-center gap-2">
                <span className="flex h-12 shrink-0 items-center justify-center rounded-xl border border-gold/40 bg-gold/[0.07] px-3 font-bold text-gold text-sm">
                  {t("modifier")}
                </span>
                <input
                  value={data[field]}
                  onChange={(e) => onChange({ [field]: e.target.value })}
                  placeholder={placeholder}
                  maxLength={40}
                  autoCapitalize="words"
                  className="h-12 flex-1 rounded-xl border border-border bg-surface-2/60 px-4 text-foreground outline-none transition placeholder:text-muted/50 focus:border-gold focus:bg-surface-2 focus:shadow-[0_0_0_3px_rgba(217,164,65,0.15)]"
                />
              </div>
            </div>
          ),
        )}
      </div>

      <div className="rounded-2xl border border-border/50 bg-surface-2/20 p-4">
        <p className="text-xs leading-relaxed text-muted/70">
          Experiences are personal — no list defines them. Choose something that captures who your character is and what they&apos;ve done. Each one gives you +2 on any roll where it&apos;s relevant.
        </p>
      </div>
    </div>
  );
}
