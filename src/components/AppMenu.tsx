"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IconLogout } from "@tabler/icons-react";
import { logout } from "@/lib/auth/actions";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { BottomSheet } from "@/components/ui/BottomSheet";

export function AppMenu({ username }: { username: string }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const initial = username.charAt(0).toUpperCase();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t("nav.menu")}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.12] font-display text-lg font-semibold text-gold transition active:scale-95"
      >
        {initial}
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} label={t("nav.menu")}>
        <div className="flex flex-col items-center gap-5 pb-2 text-center">
          {/* Identity */}
          <div className="flex flex-col items-center gap-2">
            <span className="dh-mark-glow flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/[0.12] font-display text-2xl font-semibold text-gold">
              {initial}
            </span>
            <div>
              <p className="text-xs text-muted">{t("nav.signedInAs")}</p>
              <p className="max-w-[24ch] truncate font-display text-lg font-semibold text-foreground">
                {username}
              </p>
            </div>
          </div>

          {/* Language */}
          <div className="flex w-full flex-col items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              {t("locale.label")}
            </span>
            <LocaleSwitcher fullWidth />
          </div>

          {/* Sign out */}
          <form action={logout} className="w-full">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-danger/30 bg-danger/10 font-medium text-danger transition active:scale-[0.99]"
            >
              <IconLogout size={20} stroke={1.8} />
              {t("nav.signOut")}
            </button>
          </form>
        </div>
      </BottomSheet>
    </>
  );
}
