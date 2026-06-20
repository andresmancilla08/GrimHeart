"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { AppDialog } from "@/components/ui/AppDialog";
import { deleteCharacter } from "@/lib/characters/actions";
import type { Character } from "@/lib/daggerheart/types";

export function CharacterActionsMenu({ character }: { character: Character }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Editing is only available before any level-up.
  const canEdit = character.level <= 1;

  function handleDelete() {
    startTransition(async () => {
      await deleteCharacter(character.id);
      setDeleteOpen(false);
      router.push("/characters");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label={t("character.actions.menu")}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.12] text-gold transition hover:brightness-110 active:scale-95"
      >
        <IconDots size={20} stroke={1.8} />
      </button>

      {/* Action sheet */}
      <BottomSheet open={menuOpen} onClose={() => setMenuOpen(false)} label={t("character.actions.menu")}>
        <div className="flex flex-col gap-2 pb-2">
          <h2 className="pb-1 text-center font-display text-lg font-semibold text-foreground">
            {character.name}
          </h2>

          {canEdit ? (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                router.push(`/characters/${character.id}/edit`);
              }}
              className="flex h-12 w-full items-center gap-3 rounded-2xl border border-border bg-surface-2/40 px-4 text-left text-foreground transition hover:border-border-strong active:scale-[0.99]"
            >
              <IconPencil size={20} stroke={1.8} className="text-gold" />
              <span className="font-medium">{t("character.actions.edit")}</span>
            </button>
          ) : (
            <div className="flex flex-col gap-1 rounded-2xl border border-border/50 bg-surface-2/20 px-4 py-3">
              <div className="flex items-center gap-3 text-muted">
                <IconPencil size={20} stroke={1.8} />
                <span className="font-medium">{t("character.actions.edit")}</span>
              </div>
              <p className="pl-8 text-xs leading-relaxed text-muted/80">
                {t("character.actions.editLockedHint")}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setDeleteOpen(true);
            }}
            className="flex h-12 w-full items-center gap-3 rounded-2xl border border-danger/30 bg-danger/[0.08] px-4 text-left text-danger transition hover:bg-danger/[0.14] active:scale-[0.99]"
          >
            <IconTrash size={20} stroke={1.8} />
            <span className="font-medium">{t("character.actions.delete")}</span>
          </button>
        </div>
      </BottomSheet>

      {/* Delete confirmation */}
      <AppDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        icon={<IconTrash size={24} stroke={1.8} />}
        title={t("character.actions.deleteTitle")}
        description={t("character.actions.deleteDesc", { name: character.name })}
        primaryLabel={isPending ? t("character.actions.deleting") : t("character.actions.deleteConfirm")}
        primaryVariant="danger"
        primaryDisabled={isPending}
        onPrimary={handleDelete}
        secondaryLabel={t("common.cancel")}
      />
    </>
  );
}
