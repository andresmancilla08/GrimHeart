"use client";

import { useTranslation } from "react-i18next";
import type { WizardData } from "./types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

export function StepIdentity({ data, onChange }: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: "wizard.identity" });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="char-name" className="text-sm font-medium text-foreground/80">
          {t("name")}
        </label>
        <input
          id="char-name"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder={t("namePlaceholder")}
          maxLength={40}
          autoCapitalize="words"
          className="h-12 rounded-xl border border-border bg-surface-2/60 px-4 text-foreground outline-none transition placeholder:text-muted/50 focus:border-gold focus:bg-surface-2 focus:shadow-[0_0_0_3px_rgba(217,164,65,0.15)]"
        />
        <p className="text-xs text-muted">{t("nameHint")}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="char-pronouns" className="text-sm font-medium text-foreground/80">
          {t("pronouns")}
        </label>
        <input
          id="char-pronouns"
          value={data.pronouns}
          onChange={(e) => onChange({ pronouns: e.target.value })}
          placeholder={t("pronounsPlaceholder")}
          maxLength={30}
          className="h-12 rounded-xl border border-border bg-surface-2/60 px-4 text-foreground outline-none transition placeholder:text-muted/50 focus:border-gold focus:bg-surface-2 focus:shadow-[0_0_0_3px_rgba(217,164,65,0.15)]"
        />
        <p className="text-xs text-muted">{t("pronounsHint")}</p>
      </div>
    </div>
  );
}
