import Image from "next/image";
import { ChefHat, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RecipeDoc } from "@/lib/types/schema";

interface RecipeCardProps {
  recipe: RecipeDoc;
  coveragePercent?: number;
  onSelect?: () => void;
}

export function RecipeCard({ recipe, coveragePercent, onSelect }: RecipeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "group flex w-full flex-col overflow-hidden border border-border text-left transition-colors",
        onSelect && "hover:border-fg"
      )}
    >
      <div className="relative aspect-4/3 w-full bg-border">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ChefHat size={32} className="text-muted" />
          </div>
        )}
        {coveragePercent !== undefined && (
          <span className="absolute right-2 top-2 bg-accent px-2 py-0.5 text-xs font-bold text-accent-fg">
            {Math.round(coveragePercent * 100)}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <h3 className="font-bold leading-tight">{recipe.title}</h3>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {recipe.dietTags.slice(0, 3).map((tag) => (
            <span key={tag} className="border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {recipe.prepTimeMinutes}m
          </span>
          <span className="flex items-center gap-1">
            <Flame size={13} /> {recipe.macroProfile.estimatedCalories} kcal
          </span>
        </div>
      </div>
    </button>
  );
}