import { fetchCandidateRecipes } from "./fetch-candidates";
import { filterAndRankMatches, type RecipeMatch } from "./pantry-matcher";

export async function getMatchesForUser(pantryItemIds: string[]): Promise<RecipeMatch[]> {
  const candidates = await fetchCandidateRecipes(pantryItemIds);
  return filterAndRankMatches(candidates, pantryItemIds);
}