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
 * Priority 1 (Vercel Pro): Workload Identity Federation via Vercel OIDC.
 * VERCEL_OIDC_TOKEN is auto-injected on Pro/Enterprise; not available on Hobby.
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

/**
 * Priority 2 (Vercel Hobby): GCP Application Default Credentials JSON stored
 * as a Vercel secret (GOOGLE_APPLICATION_CREDENTIALS_JSON).
 * Set it manually: cat ~/.config/gcloud/application_default_credentials.json
 * then paste the JSON as the env var value in Vercel dashboard.
 */
function setupADCJson(): boolean {
  const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (!credsJson) return false;

  try {
    const credsFile = "/tmp/gcp-adc-creds.json";
    fs.writeFileSync(credsFile, credsJson);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credsFile;
    return true;
  } catch (err) {
    console.error("[firebase/admin] ADC JSON setup failed:", err);
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

  // Keyless (Vercel Pro): WIF via OIDC. Fallback: ADC JSON secret (Hobby).
  // Local dev: gcloud auth application-default login (no env var needed).
  setupWIF() || setupADCJson();
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
