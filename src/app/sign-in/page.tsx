"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PhoneSignIn } from "@/components/auth/phone-sign-in";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/layout/container";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSignedIn() {
    const redirect = searchParams.get("redirect") ?? "/";
    router.push(redirect);
  }

  return (
    <>
      <Header />
      <main>
        <Container className="flex min-h-[70vh] items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="mb-6 text-2xl font-bold">Sign in to MloPika</h1>
            <PhoneSignIn onSignedIn={handleSignedIn} />
          </div>
        </Container>
      </main>
    </>
  );
}