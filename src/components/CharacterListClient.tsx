"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconSword, IconChevronRight, IconPlus, IconSparkles } from "@tabler/icons-react";
import type { Character } from "@/lib/daggerheart/types";

export function CharacterListClient({ characters }: { characters: Character[] }) {
  const { t } = useTranslation();

  return (
    <>
      {/* Contenido scrollable: header + lista/empty state */}
      <div className="dh-rise flex flex-col gap-6 pb-32">
        {/* Header: solo título + subtitle, sin botón aquí */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {t("characters.title")}
          </h1>
          <p className="mt-1 text-sm text-muted">{t("characters.subtitle")}</p>
        </div>

        {characters.length === 0 ? (
          /* Empty state: centrado, atmosférico, sin CTA aquí */
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            {/* Icono con glow de Hope */}
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(217,164,65,0.18) 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
                aria-hidden
              />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-gold/20 bg-surface-2/60">
                <IconSword
                  size={36}
                  stroke={1.2}
                  className="text-gold/50"
                  style={{ transform: "rotate(-45deg)" }}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="max-w-[24ch]">
              <p className="font-display text-lg font-semibold text-foreground">
                {t("characters.empty")}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {t("characters.emptyHint")}
              </p>
            </div>

            {/* Detalle decorativo: línea de separación con glow */}
            <div className="flex items-center gap-3 opacity-40" aria-hidden>
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
              <IconSparkles size={12} className="text-gold" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
            </div>
          </div>
        ) : (
          /* Lista de personajes */
          <div className="flex flex-col gap-3">
            {characters.map((char, i) => (
              <Link
                key={char.id}
                href={`/characters/${char.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-surface-2/30 p-4 transition-all duration-150 hover:border-border-strong hover:bg-surface-2/60 active:scale-[0.985]"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Avatar con inicial */}
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                  <span className="font-display text-lg font-bold text-gold">
                    {char.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-semibold text-foreground">
                    {char.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {t(`dh.class.${char.classKey}`)}
                    <span className="mx-1.5 opacity-40">·</span>
                    {t("characters.level", { level: char.level })}
                  </p>
                </div>

                <IconChevronRight
                  size={18}
                  className="shrink-0 text-muted/40 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-muted/70"
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA fijo al fondo */}
      <div className="fixed bottom-0 left-0 right-0 z-20 flex flex-col items-center px-5 pb-safe bg-gradient-to-t from-background via-background/95 to-transparent pt-8">
        <div className="mb-4 w-full max-w-lg">
          <Link
            href="/characters/new"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright to-gold text-sm font-semibold text-[#2a1d05] shadow-[0_8px_32px_-8px_rgba(217,164,65,0.65)] transition-all duration-150 hover:brightness-105 active:scale-[0.98]"
          >
            <IconPlus size={18} stroke={2.5} />
            {t("characters.create")}
          </Link>
        </div>
      </div>
    </>
  );
}
