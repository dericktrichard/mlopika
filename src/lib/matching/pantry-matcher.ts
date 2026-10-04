import type { RecipeDoc } from "@/lib/types/schema";

export interface RecipeMatch {
  recipe: RecipeDoc;
  coveragePercent: number;
  missingIngredientIds: string[];
  missingRequiredIngredientIds: string[];
}

const COVERAGE_THRESHOLD = 0.7;

export function scoreRecipeMatch(
  recipe: RecipeDoc,
  pantryItemIds: string[]
): RecipeMatch {
  const pantrySet = new Set(pantryItemIds);
  const totalIngredients = recipe.ingredientIds.length;

  const missingIngredientIds = recipe.ingredientIds.filter(
    (id) => !pantrySet.has(id)
  );
  const matchedCount = totalIngredients - missingIngredientIds.length;
  const coveragePercent = totalIngredients === 0 ? 0 : matchedCount / totalIngredients;

  const missingRequiredIngredientIds = recipe.requiredIngredientIds.filter(
    (id) => !pantrySet.has(id)
  );

  return {
    recipe,
    coveragePercent,
    missingIngredientIds,
    missingRequiredIngredientIds,
  };
}

export function filterAndRankMatches(
  candidates: RecipeDoc[],
  pantryItemIds: string[]
): RecipeMatch[] {
  return candidates
    .map((recipe) => scoreRecipeMatch(recipe, pantryItemIds))
    .filter(
      (match) =>
        match.coveragePercent >= COVERAGE_THRESHOLD &&
        match.missingRequiredIngredientIds.length === 0
    )
    .sort((a, b) => b.coveragePercent - a.coveragePercent);
}