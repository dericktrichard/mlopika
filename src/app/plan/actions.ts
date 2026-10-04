"use server";

import { adminDb } from "@/lib/firebase/admin";
import { validateWeeklyPlan } from "@/lib/diet/diet-validator";
import type { RecipeDoc, WeeklyPlanDoc } from "@/lib/types/schema";

export async function checkWeeklyPlan(plan: WeeklyPlanDoc) {
  const recipeIds = Array.from(new Set(plan.days.flatMap((d) => d.recipeIds)));
  if (recipeIds.length === 0) {
    return validateWeeklyPlan(plan, new Map());
  }

  const snapshot = await adminDb
    .collection("recipes")
    .where("id", "in", recipeIds.slice(0, 30))
    .get();

  const recipesById = new Map<string, RecipeDoc>(
    snapshot.docs.map((doc) => [doc.id, { id: doc.id, ...doc.data() } as RecipeDoc])
  );

  return validateWeeklyPlan(plan, recipesById);
}

export async function getRecipesByIds(recipeIds: string[]): Promise<RecipeDoc[]> {
  if (recipeIds.length === 0) return [];
  const snapshot = await adminDb
    .collection("recipes")
    .where("id", "in", recipeIds.slice(0, 30))
    .get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RecipeDoc);
}

export async function getAllRecipes(): Promise<RecipeDoc[]> {
  const snapshot = await adminDb.collection("recipes").get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as RecipeDoc);
}