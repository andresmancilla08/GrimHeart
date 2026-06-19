"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { adminDb } from "@/lib/firebase/admin";
import { createSession, destroySession } from "./session";
import {
  usernameKey,
  validatePin,
  validateUsername,
} from "./validation";

export interface AuthState {
  error?: string; // i18n key
  field?: "username" | "pin";
}

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

export async function register(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const username = String(formData.get("username") ?? "");
  const pin = String(formData.get("pin") ?? "");

  const uErr = validateUsername(username);
  if (uErr) return { error: uErr, field: "username" };
  const pErr = validatePin(pin);
  if (pErr) return { error: pErr, field: "pin" };

  const key = usernameKey(username);
  const ref = adminDb().collection("users").doc(key);
  const pinHash = await bcrypt.hash(pin, 10);

  try {
    await ref.create({
      username: username.trim(),
      usernameLower: key,
      pinHash,
      failedAttempts: 0,
      lockedUntil: 0,
      createdAt: Date.now(),
    });
  } catch {
    // create() throws if the doc already exists.
    return { error: "auth.errors.usernameTaken", field: "username" };
  }

  await createSession({ uid: key, username: username.trim() });
  redirect("/");
}

export async function login(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const username = String(formData.get("username") ?? "");
  const pin = String(formData.get("pin") ?? "");

  if (validateUsername(username)) return { error: "auth.errors.invalidCredentials" };
  if (validatePin(pin)) return { error: "auth.errors.invalidCredentials" };

  const key = usernameKey(username);
  const ref = adminDb().collection("users").doc(key);
  const snap = await ref.get();
  if (!snap.exists) return { error: "auth.errors.invalidCredentials" };

  const data = snap.data()!;
  const now = Date.now();
  if ((data.lockedUntil ?? 0) > now) return { error: "auth.errors.locked" };

  const ok = await bcrypt.compare(pin, data.pinHash);
  if (!ok) {
    const attempts = (data.failedAttempts ?? 0) + 1;
    await ref.update({
      failedAttempts: attempts,
      lockedUntil: attempts >= MAX_ATTEMPTS ? now + LOCK_MS : 0,
    });
    return {
      error: attempts >= MAX_ATTEMPTS ? "auth.errors.locked" : "auth.errors.invalidCredentials",
    };
  }

  await ref.update({ failedAttempts: 0, lockedUntil: 0 });
  await createSession({ uid: key, username: data.username });
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
