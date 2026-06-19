"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CLASSES } from "@/lib/daggerheart/reference";
import { CLASS_DEFS, SUBCLASS_DEFS } from "@/lib/daggerheart/classes";
import type { SubclassKey } from "@/lib/daggerheart/classes";
import type { WizardData } from "./types";
import type { ClassKey } from "@/lib/daggerheart/types";

interface Props {
  data: WizardData;
  onChange: (patch: Partial<WizardData>) => void;
}

const CLASS_ART: Record<string, string> = {
  bard:     "/art/bard.jpg",
  druid:    "/art/druid.jpg",
  guardian: "/art/guardian.jpg",
  ranger:   "/art/ranger.jpg",
  rogue:    "/art/rogue.jpg",
  seraph:   "/art/seraph.jpg",
  sorcerer: "/art/sorcerer.jpg",
  warrior:  "/art/warrior.jpg",
  wizard:   "/art/wizard.jpg",
};

const CLASS_ART_POSITION: Record<string, string> = {
  bard:     "object-top",
  druid:    "object-top",
  guardian: "object-[center_35%]",
  ranger:   "object-top",
  rogue:    "object-top",
  seraph:   "object-[center_10%]",
  sorcerer: "object-top",
  warrior:  "object-top",
  wizard:   "object-top",
};

const domainColors: Record<string, string> = {
  arcana:   "text-purple-300 bg-purple-900/30",
  blade:    "text-red-300 bg-red-900/30",
  bone:     "text-stone-300 bg-stone-800/40",
  codex:    "text-blue-300 bg-blue-900/30",
  grace:    "text-pink-300 bg-pink-900/30",
  midnight: "text-indigo-300 bg-indigo-900/30",
  sage:     "text-green-300 bg-green-900/30",
  splendor: "text-gold bg-gold/10",
  valor:    "text-amber-300 bg-amber-900/30",
};

export function StepClass({ data, onChange }: Props) {
  const { t } = useTranslation();
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll selected card into view after expansion animation completes (260ms)
  useEffect(() => {
    if (!data.classKey) return;
    const key = data.classKey;
    const t = setTimeout(() => {
      cardRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 280);
    return () => clearTimeout(t);
  }, [data.classKey]);

  return (
    <div className="flex flex-col gap-4">
      {/* 2-col on mobile, 3-col on desktop */}
      <div role="radiogroup" className="grid grid-cols-2 items-start gap-3 lg:grid-cols-3">
        {CLASSES.map((key) => {
          const def = CLASS_DEFS[key];
          const art = CLASS_ART[key];
          const isSelected = data.classKey === key;
          const subclasses = def.subclasses.map((sk) => SUBCLASS_DEFS[sk]);
          const hasSubclass = isSelected && data.subclassKey !== null;

          return (
            // div instead of <button> so nested <button> subclass pills are valid HTML
            <div
              key={key}
              ref={(el) => { cardRefs.current[key] = el; }}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() =>
                onChange({ classKey: key as ClassKey, subclassKey: null, domainCardIds: [] })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange({ classKey: key as ClassKey, subclassKey: null, domainCardIds: [] });
                }
              }}
              className={[
                "group relative flex cursor-pointer select-none flex-col overflow-hidden rounded-2xl border text-left",
                "transition-all duration-150 active:scale-[0.97]",
                // Selected card spans full row on mobile so no empty space appears next to it
                isSelected ? "col-span-2 lg:col-span-1" : "col-span-1",
                isSelected
                  ? hasSubclass
                    ? "border-gold shadow-[0_0_0_1px_rgba(217,164,65,0.6),0_0_24px_-4px_rgba(217,164,65,0.5),0_4px_24px_-8px_rgba(217,164,65,0.3)]"
                    : "border-gold/70 shadow-[0_0_0_1px_rgba(217,164,65,0.4),0_0_18px_-4px_rgba(217,164,65,0.35)]"
                  : "border-border bg-surface-2/40 hover:border-border-strong",
              ].join(" ")}
            >
              {/* Art with name + domains overlaid at bottom (cinematographic) */}
              {art ? (
                <div className="relative h-[150px] w-full shrink-0">
                  <Image
                    src={art}
                    alt=""
                    fill
                    className={`object-cover ${CLASS_ART_POSITION[key] ?? "object-top"} transition-transform duration-300 group-hover:scale-[1.04]`}
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Top vignette */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#17131f]/50 via-transparent to-transparent" />
                  {/* Bottom gradient — deeper for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0b16] via-[#0e0b16]/60 to-transparent" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-t from-gold/[0.08] via-transparent to-transparent" />
                  )}
                  {/* Class name + domains overlaid at bottom of art */}
                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                    <p className="font-display text-[13px] font-bold leading-tight text-foreground drop-shadow-sm">
                      {t(`dh.class.${key}`)}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {def.domains.map((d) => (
                        <span
                          key={d}
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur-sm ${domainColors[d] ?? "text-muted bg-surface"}`}
                        >
                          {t(`dh.domain.${d}`)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[150px] w-full shrink-0 bg-surface-2/60" />
              )}

              {/* Stats row — compact, below art */}
              <div className="flex items-center gap-2 px-3 py-2.5 text-[11px] text-muted">
                <span className="font-medium">{t("wizard.class.evasion")} <strong className="text-foreground/70">{def.evasion}</strong></span>
                <span className="opacity-25">·</span>
                <span className="font-medium">{t("wizard.class.hp")} <strong className="text-foreground/70">{def.hp}</strong></span>
              </div>

              {/* ── Subclass expand panel ────────────────────────────────────
                  Water-drop animation: grid-template-rows 0fr→1fr with spring
                  cubic-bezier(0.22, 1.4, 0.36, 1) → expands fast, tiny bounce
                  Content fades in after 60ms delay with stagger per pill       */}
              <div
                aria-hidden={!isSelected}
                style={{
                  display: "grid",
                  gridTemplateRows: isSelected ? "1fr" : "0fr",
                  transition: isSelected
                    ? "grid-template-rows 260ms cubic-bezier(0.16, 1, 0.3, 1)"
                    : "grid-template-rows 200ms cubic-bezier(0.4, 0, 0.6, 1)",
                }}
              >
                <div className="overflow-hidden">
                  <div
                    role="presentation"
                    onClick={(e) => e.stopPropagation()}
                    className="border-t border-gold/20 bg-gold/[0.04] px-2.5 pb-2.5 pt-2"
                  >
                    <p
                      className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-gold/50"
                      style={{
                        opacity: isSelected ? 1 : 0,
                        transition: isSelected ? "opacity 160ms ease 60ms" : "opacity 80ms ease",
                      }}
                    >
                      {t("wizard.class.subclassTitle")}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {subclasses.map((sub, i) => {
                        const subSelected = data.subclassKey === sub.key;
                        const delay = isSelected ? 80 + i * 50 : 0;
                        return (
                          <div
                            key={sub.key}
                            style={{
                              opacity: isSelected ? 1 : 0,
                              transform: isSelected ? "translateY(0)" : "translateY(-4px)",
                              transition: isSelected
                                ? `opacity 160ms ease ${delay}ms, transform 220ms cubic-bezier(0.22, 1.4, 0.36, 1) ${delay}ms`
                                : "opacity 80ms ease, transform 80ms ease",
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onChange({ subclassKey: sub.key as SubclassKey });
                              }}
                              className={[
                                "w-full rounded-xl px-2.5 py-2.5 text-left text-xs transition-all duration-150 active:scale-[0.97]",
                                subSelected
                                  ? "border border-gold/50 bg-gold/15 text-gold shadow-[inset_0_0_0_1px_rgba(217,164,65,0.2)]"
                                  : "border border-border/40 bg-surface/30 text-muted hover:border-gold/30 hover:text-foreground",
                              ].join(" ")}
                            >
                              <span className="block font-display font-semibold leading-tight">
                                {t(`dh.subclass.${sub.key}`)}
                              </span>
                              {sub.spellcastTrait && (
                                <span className="mt-0.5 block text-[10px] opacity-60">
                                  {t("wizard.class.spellcast", {
                                    trait: t(`dh.trait.${sub.spellcastTrait}`),
                                  })}
                                </span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkmark: solid gold when subclass also selected, dimmed when only class */}
              {isSelected && (
                <span
                  className={[
                    "absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200",
                    hasSubclass
                      ? "bg-gold text-[#2a1d05] shadow-[0_0_10px_rgba(217,164,65,0.7)]"
                      : "bg-gold/60 text-[#2a1d05]",
                  ].join(" ")}
                >
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
