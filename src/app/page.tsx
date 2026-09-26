import { Header } from "@/components/layout/header";
import { Container } from "@/components/layout/container";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Container className="py-16">
          <h1 className="text-4xl font-bold tracking-tight">
            What can you cook right now?
          </h1>
          <p className="mt-2 text-muted">
            Tell us what&apos;s in your kitchen. We&apos;ll tell you what to
            make.
          </p>
        </Container>
      </main>
    </>
  );
}