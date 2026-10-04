"use client";

import { useState } from "react";
import { PantrySelector } from "@/components/pantry/pantry-selector";
import { RecipeResults } from "@/components/pantry/recipe-results";
import { findMatches } from "./actions";
import type { IngredientDoc } from "@/lib/types/schema";
import type { RecipeMatch } from "@/lib/matching/pantry-matcher";

export function PantryClient({ ingredients }: { ingredients: IngredientDoc[] }) {
  const [matches, setMatches] = useState<RecipeMatch[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(selectedIds: string[]) {
    setLoading(true);
    const result = await findMatches(selectedIds);
    setMatches(result);
    setLoading(false);
  }

  return (
    <div>
      <PantrySelector ingredients={ingredients} onSubmit={handleSubmit} />
      <div className="mt-8">
        {loading && <p className="text-muted">Matching...</p>}
        {!loading && matches && <RecipeResults matches={matches} />}
      </div>
    </div>
  );
}