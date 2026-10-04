import { Header } from "@/components/layout/header";
import { Container } from "@/components/layout/container";
import { EateryClient } from "./eatery-client";

export default function EateriesPage() {
  return (
    <>
      <Header />
      <main>
        <Container className="py-12">
          <h1 className="mb-6 text-2xl font-bold">Eateries near you</h1>
          <EateryClient />
        </Container>
      </main>
    </>
  );
}