"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { IconChevronRight } from "@tabler/icons-react";
import { AppHeader } from "@/components/AppHeader";

interface Module {
  href: string;
  icon: string;
  labelKey: string;
  descKey: string;
  accent: string;
}

const MODULES: Module[] = [
  {
    href: "/characters",
    icon: "⚔️",
    labelKey: "home.myCharacters",
    descKey: "home.subtitle",
    accent: "from-gold/20 to-gold/5 border-gold/30",
  },
  {
    href: "/wiki",
    icon: "📖",
    labelKey: "home.wiki",
    descKey: "home.wikiDesc",
    accent: "from-fear/20 to-fear/5 border-fear/30",
  },
];

export function HomeContent({ username }: { username: string }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />

      <AppHeader username={username} />

      {/* Scrollable content */}
      <main className="dh-rise z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-4 pt-6 gap-5">
        {/* Hero image — CoreBook cover art */}
        <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-[#0c0a12]">
          <Image
            src="/art/cover.jpg"
            alt="Daggerheart"
            fill
            priority
            className="scale-[1.04]"
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="(max-width: 768px) 100vw, 700px"
          />
          {/* gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a12]/70 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="font-display text-2xl font-bold text-foreground drop-shadow-lg">
              {t("home.title")}
            </h1>
          </div>
        </div>

        {/* Modules grid */}
        <div className="flex flex-col gap-3">
          {MODULES.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`flex items-center gap-4 rounded-2xl border bg-gradient-to-r p-5 transition active:scale-[0.99] hover:brightness-105 ${mod.accent}`}
            >
              <span className="text-3xl">{mod.icon}</span>
              <div className="flex-1">
                <p className="font-display text-base font-semibold text-foreground">{t(mod.labelKey)}</p>
                <p className="mt-0.5 text-xs text-muted line-clamp-1">{t(mod.descKey)}</p>
              </div>
              <IconChevronRight size={18} className="shrink-0 text-muted/40" />
            </Link>
          ))}
        </div>

        <footer className="text-center text-xs text-muted/50 pb-2">
          {t("app.tagline")}
        </footer>
      </main>

      {/* Fixed bottom CTA */}
      <div className="z-10 shrink-0 px-5 pt-6" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}>
        <Link
          href="/characters/new"
          className="flex h-14 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99]"
        >
          + {t("home.cta")}
        </Link>
      </div>
    </div>
  );
}
