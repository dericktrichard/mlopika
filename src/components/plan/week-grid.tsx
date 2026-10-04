import { Plus } from "lucide-react";
import type { RecipeDoc, WeekDay, WeeklyPlanDoc } from "@/lib/types/schema";

const DAY_LABELS: Record<WeekDay, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday",
  fri: "Friday", sat: "Saturday", sun: "Sunday",
};

interface WeekGridProps {
  plan: WeeklyPlanDoc;
  recipesById: Map<string, RecipeDoc>;
  onAddMeal: (day: WeekDay) => void;
  onRemoveMeal: (day: WeekDay, recipeId: string) => void;
}

export function WeekGrid({ plan, recipesById, onAddMeal, onRemoveMeal }: WeekGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
      {plan.days.map(({ day, recipeIds }) => (
        <div key={day} className="flex flex-col border border-border">
          <div className="border-b border-border bg-border/30 px-3 py-2">
            <h3 className="text-sm font-bold">{DAY_LABELS[day]}</h3>
          </div>

          <div className="flex flex-1 flex-col gap-2 p-2">
            {recipeIds.map((id) => {
              const recipe = recipesById.get(id);
              if (!recipe) return null;
              return (
                <div key={id} className="flex items-center justify-between border border-border px-2 py-1.5 text-xs">
                  <span className="truncate">{recipe.title}</span>
                  <button onClick={() => onRemoveMeal(day, id)} className="shrink-0 pl-2 text-muted hover:text-danger">
                    &times;
                  </button>
                </div>
              );
            })}

            <button
              onClick={() => onAddMeal(day)}
              className="flex items-center justify-center gap-1 border border-dashed border-border py-2 text-xs text-muted hover:border-fg hover:text-fg"
            >
              <Plus size={14} /> Add meal
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}