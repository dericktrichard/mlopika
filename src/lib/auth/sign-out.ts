import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function signOut() {
  await firebaseSignOut(auth);
  await fetch("/api/session", { method: "DELETE" });
}