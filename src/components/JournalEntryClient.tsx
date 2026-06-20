"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { JournalForm } from "@/components/JournalForm";
import { AppDialog } from "@/components/ui/AppDialog";
import { updateJournalEntry, deleteJournalEntry } from "@/lib/characters/actions";
import type { JournalEntry } from "@/lib/daggerheart/types";

interface Props {
  characterId: string;
  entry: JournalEntry;
}

export function JournalEntryClient({ characterId, entry }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function fmtDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString(i18n.language, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  function handleSave(title: string | undefined, body: string) {
    startTransition(async () => {
      const res = await updateJournalEntry(characterId, entry.id, { title, body });
      if ("error" in res) return;
      setEditOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteJournalEntry(characterId, entry.id);
      router.replace(`/characters/${characterId}/journal`);
    });
  }

  return (
    <main className="z-10 flex min-h-0 flex-1 flex-col">
      {/* Fixed header — date + title + rule */}
      <header className="dh-rise shrink-0 px-5 pt-2">
        <div className="mx-auto w-full max-w-2xl">
          <time className="text-xs font-semibold uppercase tracking-[0.14em] text-gold/70">
            {fmtDate(entry.createdAt)}
          </time>
          {entry.title && (
            <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-foreground">
              {entry.title}
            </h1>
          )}
          {/* Decorative rule */}
          <div className="mt-4 flex items-center gap-3 opacity-50" aria-hidden>
            <span className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
            <span className="text-gold/60">✦</span>
            <span className="h-px flex-1 bg-gradient-to-l from-gold/50 to-transparent" />
          </div>
        </div>
      </header>

      {/* Scrollable body only */}
      <article className="min-h-0 flex-1 overflow-y-auto px-5 pb-40 pt-5">
        <p className="mx-auto w-full max-w-2xl whitespace-pre-line text-justify text-[15px] leading-relaxed text-foreground/85 [hyphens:auto]">
          {entry.body}
        </p>
      </article>

      {/* Fixed actions (15px padding container — app rule) */}
      <div
        className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1 bg-gradient-to-t from-background via-background/95 to-transparent px-[15px] pt-8"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 15px)" }}
      >
        <div className="flex w-full max-w-lg flex-col gap-2">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright"
          >
            <IconPencil size={18} stroke={2} />
            {t("journal.editEntry")}
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-danger/30 bg-danger/[0.08] text-sm font-medium text-danger transition hover:bg-danger/[0.14] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/50"
          >
            <IconTrash size={18} stroke={1.8} />
            {t("journal.delete")}
          </button>
        </div>
      </div>

      <JournalForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        isEdit
        initialTitle={entry.title}
        initialBody={entry.body}
        pending={isPending}
        onSubmit={handleSave}
      />

      <AppDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        icon={<IconTrash size={24} stroke={1.8} />}
        title={t("journal.deleteTitle")}
        description={t("journal.deleteDesc")}
        primaryLabel={isPending ? t("journal.deleting") : t("journal.deleteConfirm")}
        primaryVariant="danger"
        primaryDisabled={isPending}
        onPrimary={handleDelete}
        secondaryLabel={t("common.cancel")}
      />
    </main>
  );
}
