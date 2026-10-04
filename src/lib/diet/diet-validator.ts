import type { RecipeDoc, WeeklyPlanDoc } from "@/lib/types/schema";

export interface DietCheck {
  id: "balanced-macros" | "adequate-calories" | "varied";
  passed: boolean;
  detail: string;
}

export interface DietValidationResult {
  checks: DietCheck[];
  overallBalanced: boolean;
}

const AMDR = {
  proteinMin: 0.10,
  proteinMax: 0.35,
  carbMin: 0.45,
  carbMax: 0.65,
  fatMin: 0.20,
  fatMax: 0.35,
};

const MIN_DAILY_CALORIES = 1600;
const MAX_REPEATS_PER_WEEK = 3;

function sumMacros(recipeIds: string[], recipesById: Map<string, RecipeDoc>) {
  return recipeIds.reduce(
    (acc, id) => {
      const recipe = recipesById.get(id);
      if (!recipe) return acc;
      acc.calories += recipe.macroProfile.estimatedCalories;
      acc.protein += recipe.macroProfile.proteinGrams;
      acc.carbs += recipe.macroProfile.carbGrams;
      acc.fat += recipe.macroProfile.fatGrams;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function validateWeeklyPlan(
  plan: WeeklyPlanDoc,
  recipesById: Map<string, RecipeDoc>
): DietValidationResult {
  const allRecipeIds = plan.days.flatMap((d) => d.recipeIds);
  const totals = sumMacros(allRecipeIds, recipesById);
  const daysWithMeals = plan.days.filter((d) => d.recipeIds.length > 0).length || 1;

  const avgDailyCalories = totals.calories / daysWithMeals;
  const proteinCalories = totals.protein * 4;
  const carbCalories = totals.carbs * 4;
  const fatCalories = totals.fat * 9;
  const totalMacroCalories = proteinCalories + carbCalories + fatCalories || 1;

  const proteinRatio = proteinCalories / totalMacroCalories;
  const carbRatio = carbCalories / totalMacroCalories;
  const fatRatio = fatCalories / totalMacroCalories;

  const macrosBalanced =
    proteinRatio >= AMDR.proteinMin && proteinRatio <= AMDR.proteinMax &&
    carbRatio >= AMDR.carbMin && carbRatio <= AMDR.carbMax &&
    fatRatio >= AMDR.fatMin && fatRatio <= AMDR.fatMax;

  const caloriesAdequate = avgDailyCalories >= MIN_DAILY_CALORIES;

  const repeatCounts = new Map<string, number>();
  for (const id of allRecipeIds) {
    repeatCounts.set(id, (repeatCounts.get(id) ?? 0) + 1);
  }
  const maxRepeats = Math.max(0, ...repeatCounts.values());
  const varied = maxRepeats <= MAX_REPEATS_PER_WEEK;

  const checks: DietCheck[] = [
    {
      id: "balanced-macros",
      passed: macrosBalanced,
      detail: `Protein ${Math.round(proteinRatio * 100)}%, carbs ${Math.round(carbRatio * 100)}%, fat ${Math.round(fatRatio * 100)}%`,
    },
    {
      id: "adequate-calories",
      passed: caloriesAdequate,
      detail: `Averaging ${Math.round(avgDailyCalories)} kcal/day`,
    },
    {
      id: "varied",
      passed: varied,
      detail: varied ? "Good variety across the week" : "One recipe repeats too often this week",
    },
  ];

  return { checks, overallBalanced: checks.every((c) => c.passed) };
}