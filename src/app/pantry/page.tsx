import { adminDb } from "@/lib/firebase/admin";
import { Header } from "@/components/layout/header";
import { Container } from "@/components/layout/container";
import { PantryClient } from "./pantry-client";
import type { IngredientDoc } from "@/lib/types/schema";

async function getIngredients(): Promise<IngredientDoc[]> {
  const snapshot = await adminDb.collection("ingredients").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as IngredientDoc);
}

export default async function PantryPage() {
  const ingredients = await getIngredients();

  return (
    <>
      <Header />
      <main>
        <Container className="py-12">
          <h1 className="mb-6 text-2xl font-bold">What&apos;s in your kitchen?</h1>
          <PantryClient ingredients={ingredients} />
        </Container>
      </main>
    </>
  );
}