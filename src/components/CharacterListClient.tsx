"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
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
          + {t("characters.create")}
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface-2/40">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">{t("characters.empty")}</p>
            <p className="mt-1 text-sm text-muted">{t("characters.emptyHint")}</p>
          </div>
          <Link
            href="/characters/new"
            className="mt-2 h-12 rounded-full bg-gradient-to-b from-gold-bright to-gold px-8 text-sm font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] flex items-center"
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
              {/* Avatar */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-lg font-bold text-gold">
                {char.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-base font-semibold text-foreground truncate">{char.name}</p>
                <p className="text-xs text-muted">
                  {t(`dh.class.${char.classKey}`)} · {t("characters.level", { level: char.level })}
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
