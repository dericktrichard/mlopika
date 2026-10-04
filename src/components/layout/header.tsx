"use client";

import { LogOut } from "lucide-react";
import { Container } from "./container";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuth } from "@/lib/auth/auth-context";
import { signOut } from "@/lib/auth/sign-out";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <span className="text-lg font-bold tracking-tight">MloPika</span>
        <div className="flex items-center gap-3">
          {!loading && user && (
            <button
              onClick={handleSignOut}
              aria-label="Sign out"
              className="flex items-center gap-1.5 text-sm text-muted hover:text-fg"
            >
              <LogOut size={15} /> Sign out
            </button>
          )}
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}