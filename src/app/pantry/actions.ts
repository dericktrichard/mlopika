"use server";

import { getMatchesForUser } from "@/lib/matching/get-matches-for-user";

export async function findMatches(pantryItemIds: string[]) {
  return getMatchesForUser(pantryItemIds);
}