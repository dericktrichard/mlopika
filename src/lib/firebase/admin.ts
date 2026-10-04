import "server-only";
import {
  initializeApp,
  getApps,
  getApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

function getAdminApp(): App {
  if (getApps().length) return getApp();

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Env vars store \n as literal two-character escapes; convert back to real newlines.
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminApp = getAdminApp();
export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);