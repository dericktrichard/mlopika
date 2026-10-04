import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

let recaptchaVerifier: RecaptchaVerifier | null = null;

function getRecaptcha(containerId: string): RecaptchaVerifier {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  }
  return recaptchaVerifier;
}

export async function startPhoneSignIn(
  phoneNumber: string,
  recaptchaContainerId: string
): Promise<ConfirmationResult> {
  const verifier = getRecaptcha(recaptchaContainerId);
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
}