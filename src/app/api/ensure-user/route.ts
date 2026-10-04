import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { UserDoc } from "@/lib/types/schema";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const userRef = adminDb.collection("users").doc(decoded.uid);
  const existing = await userRef.get();

  if (!existing.exists) {
    const newUser: UserDoc = {
      uid: decoded.uid,
      displayName: decoded.name ?? "Student",
      phoneNumber: decoded.phone_number ?? null,
      email: decoded.email ?? null,
      createdAt: new Date().toISOString(),
      subscriptionTier: "free",
      familyGroupId: null,
      pantryItemIds: [],
    };
    await userRef.set(newUser);
  }

  return NextResponse.json({ ok: true });
}