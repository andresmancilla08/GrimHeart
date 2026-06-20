"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IconPlus, IconBook, IconTrash, IconPencil } from "@tabler/icons-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { AppDialog } from "@/components/ui/AppDialog";
import {
  addJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/lib/characters/actions";
import type { JournalEntry } from "@/lib/daggerheart/types";

interface Props {
  characterId: string;
  characterName: string;
  entries: JournalEntry[];
}

export function JournalClient({ characterId, characterName, entries }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function openNew() {
    setEditing(null);
    setTitle("");
    setBody("");
    setSheetOpen(true);
  }

  function openEdit(entry: JournalEntry) {
    setEditing(entry);
    setTitle(entry.title ?? "");
    setBody(entry.body);
    setSheetOpen(true);
  }

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

  function handleSave() {
    if (!body.trim()) return;
    startTransition(async () => {
      const payload = { title: title.trim() || undefined, body: body.trim() };
      const res = editing
        ? await updateJournalEntry(characterId, editing.id, payload)
        : await addJournalEntry(characterId, payload);
      if ("error" in res) return;
      setSheetOpen(false);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!editing) return;
    startTransition(async () => {
      await deleteJournalEntry(characterId, editing.id);
      setConfirmDelete(false);
      setSheetOpen(false);
      router.refresh();
    });
  }

  return (
    <main className="z-10 flex min-h-0 flex-1 flex-col">
      {/* Header */}
      <div className="shrink-0 px-5 pb-2 pt-2 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">{t("journal.title")}</h1>
        <p className="mt-0.5 truncate text-sm text-muted">{characterName}</p>
      </div>

      {/* Entries */}
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
                  onClick={() => openEdit(entry)}
                  style={{ animationDelay: `${Math.min(i * 30, 240)}ms` }}
                  className="dh-rise group relative w-full overflow-hidden rounded-2xl border border-border bg-surface-2/30 p-4 text-left transition-all duration-150 hover:border-border-strong hover:bg-surface-2/50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                >
                  {/* Gold spine */}
                  <span className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-gold/40" aria-hidden />
                  <div className="flex items-center justify-between gap-3 pl-2">
                    <time className="text-[11px] font-medium uppercase tracking-wider text-gold/70">
                      {fmtDate(entry.createdAt)}
                    </time>
                    <IconPencil
                      size={15}
                      className="shrink-0 text-muted/40 transition group-hover:text-muted/70"
                    />
                  </div>
                  {entry.title && (
                    <h2 className="mt-1.5 pl-2 font-display text-base font-semibold leading-snug text-foreground">
                      {entry.title}
                    </h2>
                  )}
                  <p className="mt-1 line-clamp-4 whitespace-pre-line pl-2 text-sm leading-relaxed text-muted">
                    {entry.body}
                  </p>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Fixed CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-20 flex flex-col items-center bg-gradient-to-t from-background via-background/95 to-transparent px-5 pt-8"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1rem)" }}
      >
        <button
          type="button"
          onClick={openNew}
          className="flex h-14 w-full max-w-lg items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright"
        >
          <IconPlus size={18} stroke={2.5} />
          {t("journal.new")}
        </button>
      </div>

      {/* Add / edit sheet */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} label={t("journal.new")}>
        <div className="flex flex-col gap-3 pb-2">
          <h2 className="text-center font-display text-xl font-semibold text-foreground">
            {editing ? t("journal.editTitle") : t("journal.newTitle")}
          </h2>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">{t("journal.fieldTitle")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("journal.fieldTitlePlaceholder")}
              maxLength={80}
              className="h-11 rounded-2xl border border-border bg-surface-2/40 px-3.5 text-sm text-foreground placeholder:text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted">{t("journal.fieldBody")}</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t("journal.fieldBodyPlaceholder")}
              rows={6}
              className="resize-none rounded-2xl border border-border bg-surface-2/40 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!body.trim() || isPending}
            className="mt-1 flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition active:scale-[0.99] disabled:opacity-45"
          >
            {isPending ? t("journal.saving") : t("journal.save")}
          </button>

          {editing && (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-danger transition hover:bg-danger/[0.08] active:scale-[0.99]"
            >
              <IconTrash size={18} stroke={1.8} />
              {t("journal.delete")}
            </button>
          )}
        </div>
      </BottomSheet>

      {/* Delete confirmation */}
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
