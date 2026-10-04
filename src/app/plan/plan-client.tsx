"use client";

import { useState } from "react";
import { WeekGrid } from "@/components/plan/week-grid";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { DietCheckResults } from "@/components/diet/diet-check-results";
import { checkWeeklyPlan } from "./actions";
import type { RecipeDoc, WeekDay, WeeklyPlanDoc } from "@/lib/types/schema";
import type { DietValidationResult } from "@/lib/diet/diet-validator";

export function PlanClient({ initialPlan, allRecipes }: { initialPlan: WeeklyPlanDoc; allRecipes: RecipeDoc[] }) {
  const [plan, setPlan] = useState(initialPlan);
  const [pickerDay, setPickerDay] = useState<WeekDay | null>(null);
  const [dietResult, setDietResult] = useState<DietValidationResult | null>(null);

  const recipesById = new Map(allRecipes.map((r) => [r.id, r]));

  async function runCheck(nextPlan: WeeklyPlanDoc) {
    const result = await checkWeeklyPlan(nextPlan);
    setDietResult(result);
  }

  function addMeal(day: WeekDay, recipeId: string) {
    const nextPlan: WeeklyPlanDoc = {
      ...plan,
      days: plan.days.map((d) => (d.day === day ? { ...d, recipeIds: [...d.recipeIds, recipeId] } : d)),
    };
    setPlan(nextPlan);
    setPickerDay(null);
    runCheck(nextPlan);
  }

  function removeMeal(day: WeekDay, recipeId: string) {
    const nextPlan: WeeklyPlanDoc = {
      ...plan,
      days: plan.days.map((d) =>
        d.day === day ? { ...d, recipeIds: d.recipeIds.filter((id) => id !== recipeId) } : d
      ),
    };
    setPlan(nextPlan);
    runCheck(nextPlan);
  }

  return (
    <div>
      <WeekGrid
        plan={plan}
        recipesById={recipesById}
        onAddMeal={(day) => setPickerDay(day)}
        onRemoveMeal={removeMeal}
      />

      {dietResult && (
        <div className="mt-6">
          <DietCheckResults result={dietResult} />
        </div>
      )}

      {pickerDay && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-fg/40 sm:items-center" onClick={() => setPickerDay(null)}>
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-y-auto border border-border bg-bg p-4 sm:max-h-[70vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 font-bold">Add a meal for {pickerDay}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {allRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} onSelect={() => addMeal(pickerDay, recipe.id)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}