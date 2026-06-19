"use client";

import { useTranslation } from "react-i18next";
import { ANCESTRIES, COMMUNITIES } from "@/lib/daggerheart/reference";
import { SelectionCard } from "./SelectionCard";
import type { WizardData } from "./types";
import type { AncestryKey, CommunityKey } from "@/lib/daggerheart/types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

export function StepHeritage({ data, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      {/* Ancestry */}
      <div>
        <p className="mb-1 text-sm font-semibold text-foreground/70 uppercase tracking-wider">
          {t("wizard.heritage.ancestryTitle")}
        </p>
        <p className="mb-3 text-xs text-muted">{t("wizard.heritage.ancestrySubtitle")}</p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {ANCESTRIES.map((key) => (
            <SelectionCard
              key={key}
              selected={data.ancestryKey === key}
              onClick={() => onChange({ ancestryKey: key as AncestryKey })}
              title={t(`dh.ancestry.${key}`)}
              description={t(`dh.ancestry.${key}_desc`)}
            />
          ))}
        </div>
      </div>

      {/* Community */}
      <div>
        <p className="mb-1 text-sm font-semibold text-foreground/70 uppercase tracking-wider">
          {t("wizard.heritage.communityTitle")}
        </p>
        <p className="mb-3 text-xs text-muted">{t("wizard.heritage.communitySubtitle")}</p>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {COMMUNITIES.map((key) => (
            <SelectionCard
              key={key}
              selected={data.communityKey === key}
              onClick={() => onChange({ communityKey: key as CommunityKey })}
              title={t(`dh.community.${key}`)}
              description={t(`dh.community.${key}_desc`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
