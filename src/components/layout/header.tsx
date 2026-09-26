import { Container } from "./container";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <span className="text-lg font-bold tracking-tight">MloPika</span>
        <ThemeToggle />
      </Container>
    </header>
  );
}