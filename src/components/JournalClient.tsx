"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IconPlus, IconBook, IconChevronRight } from "@tabler/icons-react";
import { JournalForm } from "@/components/JournalForm";
import { addJournalEntry } from "@/lib/characters/actions";
import type { JournalEntry } from "@/lib/daggerheart/types";

interface Props {
  characterId: string;
  characterName: string;
  entries: JournalEntry[];
}

export function JournalClient({ characterId, characterName, entries }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [newOpen, setNewOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function fmtDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString(i18n.language, { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return "";
    }
  }

  function handleCreate(title: string | undefined, body: string) {
    startTransition(async () => {
      const res = await addJournalEntry(characterId, { title, body });
      if ("error" in res) return;
      setNewOpen(false);
      router.refresh();
    });
  }

  return (
    <main className="z-10 flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-5 pb-2 pt-2 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">{t("journal.title")}</h1>
        <p className="mt-0.5 truncate text-sm text-muted">{characterName}</p>
      </div>

      <div className="dh-rise min-h-0 flex-1 overflow-y-auto px-5 pb-32 pt-3">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-16 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-surface-2/60">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(217,164,65,0.16), transparent 70%)", filter: "blur(8px)" }}
                aria-hidden
              />
              <IconBook size={32} stroke={1.2} className="relative text-gold/50" />
            </div>
            <div className="max-w-[28ch]">
              <p className="font-display text-lg font-semibold text-foreground">{t("journal.emptyTitle")}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t("journal.emptyDesc")}</p>
            </div>
          </div>
        ) : (
          <ol className="flex flex-col gap-3">
            {sorted.map((entry, i) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => router.push(`/characters/${characterId}/journal/${entry.id}`)}
                  style={{ animationDelay: `${Math.min(i * 30, 240)}ms` }}
                  className="dh-rise group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-border bg-surface-2/30 p-4 text-left transition-all duration-150 hover:border-border-strong hover:bg-surface-2/50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-gold/40" aria-hidden />
                  <div className="min-w-0 flex-1 pl-2">
                    <time className="text-[11px] font-medium uppercase tracking-wider text-gold/70">
                      {fmtDate(entry.createdAt)}
                    </time>
                    {entry.title && (
                      <h2 className="mt-1.5 truncate font-display text-base font-semibold leading-snug text-foreground">
                        {entry.title}
                      </h2>
                    )}
                    <p className="mt-1 line-clamp-2 whitespace-pre-line text-sm leading-relaxed text-muted">
                      {entry.body}
                    </p>
                  </div>
                  <IconChevronRight
                    size={18}
                    className="shrink-0 text-muted/40 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-muted/70"
                  />
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Fixed CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center bg-gradient-to-t from-background via-background/95 to-transparent px-[15px] pt-8"
        style={{ paddingBottom: "15px" }}
      >
        <button
          type="button"
          onClick={() => setNewOpen(true)}
          className="mt-5 flex h-14 w-full max-w-lg items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright"
        >
          <IconPlus size={18} stroke={2.5} />
          {t("journal.new")}
        </button>
      </div>

      <JournalForm open={newOpen} onClose={() => setNewOpen(false)} pending={isPending} onSubmit={handleCreate} />
    </main>
  );
}
