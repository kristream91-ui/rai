/**
 * Pushes data/titles.json into the Firestore `titles` collection.
 *
 * Uses the Firebase Admin SDK on purpose: firestore.rules denies all client writes,
 * so a service account is the only way to seed. Nothing here runs in the browser.
 *
 * Usage:
 *   1. Put FIREBASE_SERVICE_ACCOUNT in .env.local (the full service-account JSON on one line)
 *   2. npm run seed
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { Title } from "../lib/types";

function loadEnvFile(file: string) {
  try {
    const contents = readFileSync(path.join(process.cwd(), file), "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // file is optional
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

if (!raw) {
  console.error(
    "FIREBASE_SERVICE_ACCOUNT is missing. Add the service-account JSON to .env.local first.",
  );
  process.exit(1);
}

let credentials: Record<string, string>;
try {
  credentials = JSON.parse(raw);
} catch {
  console.error("FIREBASE_SERVICE_ACCOUNT is not valid JSON. It must be the whole key file, on one line.");
  process.exit(1);
}

const app = initializeApp({
  credential: cert(credentials as Parameters<typeof cert>[0]),
  projectId: projectId ?? credentials.project_id,
});

const db = getFirestore(app);

async function main() {
  const file = path.join(process.cwd(), "data", "titles.json");
  const titles = JSON.parse(readFileSync(file, "utf8")) as Title[];

  let written = 0;
  let batch = db.batch();
  let pending = 0;

  for (const title of titles) {
    if (!title.id) {
      console.warn("Skipping a title with no id:", title.title);
      continue;
    }
    batch.set(db.collection("titles").doc(title.id), title, { merge: true });
    pending += 1;
    written += 1;

    if (pending === 400) {
      await batch.commit();
      batch = db.batch();
      pending = 0;
    }
  }

  if (pending > 0) await batch.commit();

  console.log(`Seeded ${written} titles into the "titles" collection.`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
