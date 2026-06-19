"use server";

import { cookies } from "next/headers";
import { defaultLocale, locales, type Locale } from "./config";

const COOKIE = "locale";

export async function getUserLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(COOKIE)?.value;
  return locales.includes(value as Locale) ? (value as Locale) : defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  const store = await cookies();
  store.set(COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
}
