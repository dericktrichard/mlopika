"use client";

import { useState } from "react";
import { startPhoneSignIn } from "@/lib/auth/phone-auth";
import type { ConfirmationResult } from "firebase/auth";

const RECAPTCHA_CONTAINER_ID = "recaptcha-container";

export function PhoneSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSendOtp() {
    setError(null);
    try {
      const sanitizedNumber = phoneNumber.replace(/\s+/g, "");
      const result = await startPhoneSignIn(sanitizedNumber, RECAPTCHA_CONTAINER_ID);
      setConfirmation(result);
    } catch (err) {
      console.error("Phone sign-in error:", err);
      setError(err instanceof Error ? err.message : "Couldn't send the code.");
    }
  }

  async function handleVerifyOtp() {
    setError(null);
    try {
      const credential = await confirmation?.confirm(otp);
      const idToken = await credential?.user.getIdToken();
      await fetch("/api/ensure-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      onSignedIn();
    } catch {
      setError("Incorrect code.");
    }
  }

  return (
    <div className="space-y-3">
      <div id={RECAPTCHA_CONTAINER_ID} />

      {!confirmation ? (
        <>
          <input
            type="tel"
            placeholder="+254 7XX XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full border border-border bg-bg px-3 py-2"
          />
          <button onClick={handleSendOtp} className="w-full bg-fg py-3 font-bold text-bg">
            Send code
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-border bg-bg px-3 py-2"
          />
          <button onClick={handleVerifyOtp} className="w-full bg-fg py-3 font-bold text-bg">
            Verify
          </button>
        </>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}