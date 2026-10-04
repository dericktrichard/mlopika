import { RecipeCard } from "@/components/recipe/recipe-card";
import type { RecipeMatch } from "@/lib/matching/pantry-matcher";

export function RecipeResults({ matches }: { matches: RecipeMatch[] }) {
  if (matches.length === 0) {
    return (
      <p className="text-muted">
        No recipes match 70% or more of your pantry yet. Try adding a few more staples.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {matches.map(({ recipe, coveragePercent }) => (
        <RecipeCard key={recipe.id} recipe={recipe} coveragePercent={coveragePercent} />
      ))}
    </div>
  );
}