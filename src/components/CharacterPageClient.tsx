"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CharacterSheetClient } from "@/components/CharacterSheetClient";
import { LevelUpFlow } from "@/components/LevelUpFlow";
import type { Character } from "@/lib/daggerheart/types";

interface Props {
  character: Character;
}

export function CharacterPageClient({ character }: Props) {
  const { t } = useTranslation();
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const canLevelUp = character.level < 10;

  return (
    <>
      <CharacterSheetClient character={character} />

      {/* Fixed bottom CTA — level up */}
      {canLevelUp && (
        <div className="fixed bottom-0 left-0 right-0 z-20 px-5 pt-14 pb-safe bg-gradient-to-t from-background via-background/90 to-transparent">
          <button
            type="button"
            onClick={() => setLevelUpOpen(true)}
            className="mb-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition-all duration-150 active:scale-[0.985] hover:brightness-105"
          >
            <svg aria-hidden className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            {t("levelUp.button")}
          </button>
        </div>
      )}

      <LevelUpFlow
        key={levelUpOpen ? `flow-${character.id}` : "closed"}
        character={character}
        open={levelUpOpen}
        onClose={() => setLevelUpOpen(false)}
      />
    </>
  );
}
