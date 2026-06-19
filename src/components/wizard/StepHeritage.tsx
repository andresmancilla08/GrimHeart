"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ANCESTRIES, COMMUNITIES } from "@/lib/daggerheart/reference";
import type { WizardData } from "./types";
import type { AncestryKey, CommunityKey } from "@/lib/daggerheart/types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

// Art extracted from CoreBook — populated as images become available
const ANCESTRY_ART: Partial<Record<AncestryKey, string>> = {
  clank:    "/art/ancestry/clank.jpg",
  drakona:  "/art/ancestry/drakona.jpg",
  dwarf:    "/art/ancestry/dwarf.jpg",
  elf:      "/art/ancestry/elf.jpg",
  faerie:   "/art/ancestry/faerie.jpg",
  faun:     "/art/ancestry/faun.jpg",
  firbolg:  "/art/ancestry/firbolg.jpg",
  fungril:  "/art/ancestry/fungril.jpg",
  galapa:   "/art/ancestry/galapa.jpg",
  giant:    "/art/ancestry/giant.jpg",
  goblin:   "/art/ancestry/goblin.jpg",
  halfling: "/art/ancestry/halfling.jpg",
  human:    "/art/ancestry/human.jpg",
  infernis: "/art/ancestry/infernis.jpg",
  katari:   "/art/ancestry/katari.jpg",
  orc:      "/art/ancestry/orc.jpg",
  ribbet:   "/art/ancestry/ribbet.jpg",
  simiah:   "/art/ancestry/simiah.jpg",
};

const COMMUNITY_ART: Partial<Record<CommunityKey, string>> = {
  highborne:  "/art/community/highborne.jpg",
  loreborne:  "/art/community/loreborne.jpg",
  orderborne: "/art/community/orderborne.jpg",
  ridgeborne: "/art/community/ridgeborne.jpg",
  seaborne:   "/art/community/seaborne.jpg",
  slyborne:   "/art/community/slyborne.jpg",
  underborne: "/art/community/underborne.jpg",
  wanderborne:"/art/community/wanderborne.jpg",
  wildborne:  "/art/community/wildborne.jpg",
};

// Themed gradient fallbacks per ancestry (used when no art image is available)
const ANCESTRY_FALLBACK_GRADIENT: Partial<Record<AncestryKey, string>> = {
  clank:    "from-slate-700/80 to-slate-900",
  drakona:  "from-red-900/80 to-stone-900",
  dwarf:    "from-amber-900/80 to-stone-900",
  elf:      "from-emerald-900/80 to-slate-900",
  faerie:   "from-purple-900/80 to-indigo-950",
  faun:     "from-green-900/80 to-stone-900",
  firbolg:  "from-teal-900/80 to-slate-900",
  fungril:  "from-lime-900/80 to-stone-950",
  galapa:   "from-cyan-900/80 to-slate-900",
  giant:    "from-stone-800/80 to-stone-950",
  goblin:   "from-green-800/80 to-stone-950",
  halfling: "from-rose-900/80 to-stone-900",
  human:    "from-neutral-700/80 to-stone-900",
  infernis: "from-orange-900/80 to-red-950",
  katari:   "from-yellow-800/80 to-stone-900",
  orc:      "from-green-900/80 to-stone-950",
  ribbet:   "from-cyan-800/80 to-teal-950",
  simiah:   "from-amber-800/80 to-stone-900",
};

const COMMUNITY_FALLBACK_GRADIENT: Partial<Record<CommunityKey, string>> = {
  highborne:   "from-gold/30 to-amber-900/60",
  loreborne:   "from-blue-900/80 to-indigo-950",
  orderborne:  "from-slate-700/80 to-slate-900",
  ridgeborne:  "from-stone-700/80 to-stone-950",
  seaborne:    "from-cyan-900/80 to-blue-950",
  slyborne:    "from-purple-900/80 to-slate-950",
  underborne:  "from-stone-900/80 to-zinc-950",
  wanderborne: "from-amber-900/80 to-stone-900",
  wildborne:   "from-green-900/80 to-emerald-950",
};

// Shared card component — same visual pattern as StepClass
function HeritageCard({
  cardKey,
  art,
  fallbackGradient,
  isSelected,
  label,
  description,
  onClick,
  colSpanFull,
}: {
  cardKey: string;
  art?: string;
  fallbackGradient?: string;
  isSelected: boolean;
  label: string;
  description: string;
  onClick: () => void;
  colSpanFull: boolean;
}) {
  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); }
      }}
      className={[
        "group relative flex cursor-pointer select-none flex-col overflow-hidden rounded-2xl border text-left",
        "transition-all duration-150 active:scale-[0.97]",
        colSpanFull ? "col-span-2 lg:col-span-1" : "col-span-1",
        isSelected
          ? "border-gold shadow-[0_0_0_1px_rgba(217,164,65,0.6),0_0_24px_-4px_rgba(217,164,65,0.5),0_4px_24px_-8px_rgba(217,164,65,0.3)]"
          : "border-border bg-surface-2/40 hover:border-border-strong",
      ].join(" ")}
    >
      {/* Art / fallback gradient */}
      <div className="relative h-[130px] w-full shrink-0">
        {art ? (
          <Image
            src={art}
            alt=""
            fill
            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="(max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${fallbackGradient ?? "from-surface-2 to-surface"}`} />
        )}
        {/* Top vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#17131f]/50 via-transparent to-transparent" />
        {/* Bottom gradient — scrim for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b16] via-[#0e0b16]/55 to-transparent" />
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-t from-gold/[0.08] via-transparent to-transparent" />
        )}
        {/* Name overlaid at bottom of art */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <p className="font-display text-[13px] font-bold leading-tight text-foreground drop-shadow-sm">
            {label}
          </p>
        </div>
      </div>

      {/* Description below art */}
      <div className="px-3 py-2.5">
        <p className="line-clamp-3 text-[11px] leading-relaxed text-muted">
          {description}
        </p>
      </div>

      {/* Checkmark */}
      {isSelected && (
        <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-[#2a1d05] shadow-[0_0_10px_rgba(217,164,65,0.7)]">
          ✓
        </span>
      )}
    </div>
  );
}

export function StepHeritage({ data, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-8">
      {/* ── Ancestry ─────────────────────────────────────────────────── */}
      <div>
        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-foreground/70">
          {t("wizard.heritage.ancestryTitle")}
        </p>
        <p className="mb-3 text-xs text-muted">{t("wizard.heritage.ancestrySubtitle")}</p>
        <div role="radiogroup" className="grid grid-cols-2 items-start gap-3 lg:grid-cols-3">
          {ANCESTRIES.map((key) => (
            <HeritageCard
              key={key}
              cardKey={key}
              art={ANCESTRY_ART[key]}
              fallbackGradient={ANCESTRY_FALLBACK_GRADIENT[key]}
              isSelected={data.ancestryKey === key}
              label={t(`dh.ancestry.${key}`)}
              description={t(`dh.ancestry.${key}_desc`)}
              onClick={() => onChange({ ancestryKey: key as AncestryKey })}
              colSpanFull={data.ancestryKey === key}
            />
          ))}
        </div>
      </div>

      {/* ── Community ────────────────────────────────────────────────── */}
      <div>
        <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-foreground/70">
          {t("wizard.heritage.communityTitle")}
        </p>
        <p className="mb-3 text-xs text-muted">{t("wizard.heritage.communitySubtitle")}</p>
        <div role="radiogroup" className="grid grid-cols-2 items-start gap-3 lg:grid-cols-3">
          {COMMUNITIES.map((key) => (
            <HeritageCard
              key={key}
              cardKey={key}
              art={COMMUNITY_ART[key]}
              fallbackGradient={COMMUNITY_FALLBACK_GRADIENT[key]}
              isSelected={data.communityKey === key}
              label={t(`dh.community.${key}`)}
              description={t(`dh.community.${key}_desc`)}
              onClick={() => onChange({ communityKey: key as CommunityKey })}
              colSpanFull={data.communityKey === key}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
