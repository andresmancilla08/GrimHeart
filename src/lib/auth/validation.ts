// Shared (client + server) validation for username + 4-digit PIN.
// Returns i18n message keys (under `auth.errors.*`) instead of literal strings.

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const PIN_LENGTH = 4;

const USERNAME_RE = /^[a-zA-Z][a-zA-Z0-9_]*$/;
const PIN_RE = /^\d{4}$/;

export function validateUsername(raw: string): string | null {
  const value = raw.trim();
  if (value.length === 0) return "auth.errors.usernameRequired";
  if (value.length < USERNAME_MIN) return "auth.errors.usernameShort";
  if (value.length > USERNAME_MAX) return "auth.errors.usernameLong";
  if (!USERNAME_RE.test(value)) return "auth.errors.usernameInvalid";
  return null;
}

export function validatePin(raw: string): string | null {
  if (raw.length === 0) return "auth.errors.pinRequired";
  if (!PIN_RE.test(raw)) return "auth.errors.pinInvalid";
  return null;
}

/** Canonical key used for uniqueness and as the Firestore doc id. */
export function usernameKey(raw: string): string {
  return raw.trim().toLowerCase();
}
