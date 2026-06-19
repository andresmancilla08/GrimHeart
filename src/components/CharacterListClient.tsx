"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconUser, IconChevronRight, IconPlus } from "@tabler/icons-react";
import type { Character } from "@/lib/daggerheart/types";

export function CharacterListClient({ characters }: { characters: Character[] }) {
  const { t } = useTranslation();

  return (
    <div className="dh-rise flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">{t("characters.title")}</h1>
          <p className="mt-0.5 text-sm text-muted">{t("characters.subtitle")}</p>
        </div>
        <Link
          href="/characters/new"
          className="flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-b from-gold-bright to-gold px-4 text-sm font-semibold text-[#2a1d05] shadow-[0_4px_16px_-6px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99]"
        >
          <IconPlus size={16} stroke={2.5} />
          {t("characters.create")}
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface-2/40">
            <IconUser size={32} stroke={1.2} className="text-muted/50" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">{t("characters.empty")}</p>
            <p className="mt-1 text-sm text-muted">{t("characters.emptyHint")}</p>
          </div>
          <Link
            href="/characters/new"
            className="mt-2 flex h-12 items-center rounded-full bg-gradient-to-b from-gold-bright to-gold px-8 text-sm font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99]"
          >
            {t("characters.create")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {characters.map((char) => (
            <Link
              key={char.id}
              href={`/characters/${char.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-surface-2/30 p-4 transition hover:border-border-strong hover:bg-surface-2/50 active:scale-[0.99]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-lg font-bold text-gold">
                {char.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-semibold text-foreground">{char.name}</p>
                <p className="text-xs text-muted">
                  {t(`dh.class.${char.classKey}`)} · {t("characters.level", { level: char.level })}
                </p>
              </div>
              <IconChevronRight size={18} className="shrink-0 text-muted/40" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
