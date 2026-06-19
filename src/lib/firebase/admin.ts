import "server-only";
import fs from "fs";
import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Writes the Vercel OIDC token + WIF config to /tmp so that
 * applicationDefault() can exchange them for a GCP access token.
 * No service-account key required — works via Workload Identity Federation.
 * Requires Vercel Pro or Enterprise (VERCEL_OIDC_TOKEN is auto-injected).
 */
function setupWIF(): boolean {
  const oidcToken = process.env.VERCEL_OIDC_TOKEN;
  const wifConfig = process.env.GOOGLE_WIF_CONFIG;
  if (!oidcToken || !wifConfig) return false;

  try {
    const tokenFile = "/tmp/vercel-oidc-token.txt";
    const configFile = "/tmp/wif-config.json";

    fs.writeFileSync(tokenFile, oidcToken);

    const config = JSON.parse(wifConfig) as Record<string, unknown>;
    config.credential_source = { file: tokenFile };
    fs.writeFileSync(configFile, JSON.stringify(config));

    process.env.GOOGLE_APPLICATION_CREDENTIALS = configFile;
    return true;
  } catch (err) {
    console.error("[firebase/admin] WIF setup failed:", err);
    return false;
  }
}

function getAdminApp(): App {
  const existing = getApps();
  if (existing.length) return existing[0];

  // Legacy: explicit service-account key (fallback if WIF not available).
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKey) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  }

  // Production (Vercel Pro): keyless via Workload Identity Federation.
  // Local dev: gcloud auth application-default login.
  setupWIF();
  return initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

let _db: Firestore | undefined;
export function adminDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}
