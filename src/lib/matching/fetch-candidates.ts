import { adminDb } from "@/lib/firebase/admin";
import type { RecipeDoc } from "@/lib/types/schema";

const FIRESTORE_ARRAY_CONTAINS_ANY_LIMIT = 30;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export async function fetchCandidateRecipes(
  pantryItemIds: string[]
): Promise<RecipeDoc[]> {
  if (pantryItemIds.length === 0) return [];

  const batches = chunk(pantryItemIds, FIRESTORE_ARRAY_CONTAINS_ANY_LIMIT);
  const recipesRef = adminDb.collection("recipes");

  const batchResults = await Promise.all(
    batches.map((batch) =>
      recipesRef.where("ingredientIds", "array-contains-any", batch).get()
    )
  );

  const seen = new Map<string, RecipeDoc>();
  for (const snapshot of batchResults) {
    for (const docSnap of snapshot.docs) {
      seen.set(docSnap.id, { id: docSnap.id, ...docSnap.data() } as RecipeDoc);
    }
  }

  return Array.from(seen.values());
}