"use client";

import { useActionState, useState } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { login, register, type AuthState } from "@/lib/auth/actions";
import { validateUsername } from "@/lib/auth/validation";
import { PinInput } from "./PinInput";

type Mode = "login" | "register";

export function AuthForm({ mode }: { mode: Mode }) {
  const { t } = useTranslation(undefined, { keyPrefix: "auth" });
  const action = mode === "login" ? login : register;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {},
  );

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [touched, setTouched] = useState(false);

  const usernameErr = touched ? validateUsername(username) : null;
  const canSubmit = !usernameErr && username.length > 0 && pin.length === 4;

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p
          role="alert"
          className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {t(state.error.replace("auth.", ""))}
        </p>
      )}

      {/* Username */}
      <div className="flex flex-col gap-2">
        <label htmlFor="username" className="text-sm font-medium text-foreground/80">
          {t("username")}
        </label>
        <input
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => setTouched(true)}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={t("usernamePlaceholder")}
          disabled={pending}
          className={`h-12 rounded-xl border bg-surface-2/60 px-4 text-foreground outline-none transition placeholder:text-muted/50 focus:border-gold focus:bg-surface-2 focus:shadow-[0_0_0_3px_rgba(217,164,65,0.15)] disabled:opacity-50 ${
            usernameErr ? "border-danger/70" : "border-border"
          }`}
        />
        {usernameErr && (
          <p className="text-xs text-danger">{t(usernameErr.replace("auth.", ""))}</p>
        )}
      </div>

      {/* PIN */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground/80">{t("pin")}</label>
        <input type="hidden" name="pin" value={pin} />
        <PinInput
          value={pin}
          onChange={setPin}
          disabled={pending}
          invalid={state.field === "pin"}
          ariaLabel={t("pin")}
        />
      </div>

      <button
        type="submit"
        disabled={pending || !canSubmit}
        className="mt-2 h-12 rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
      >
        {pending
          ? mode === "login"
            ? t("signingIn")
            : t("creating")
          : mode === "login"
            ? t("submitLogin")
            : t("submitRegister")}
      </button>

      <Link
        href={mode === "login" ? "/register" : "/login"}
        className="text-center text-sm text-muted underline-offset-4 transition hover:text-gold hover:underline"
      >
        {mode === "login" ? t("switchToRegister") : t("switchToLogin")}
      </Link>
    </form>
  );
}
