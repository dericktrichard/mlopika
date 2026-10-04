"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IngredientDoc } from "@/lib/types/schema";

interface PantrySelectorProps {
  ingredients: IngredientDoc[];
  initialSelected?: string[];
  onSubmit: (selectedIds: string[]) => void;
}

export function PantrySelector({ ingredients, initialSelected = [], onSubmit }: PantrySelectorProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(initialSelected));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const grouped = ingredients.reduce<Record<string, IngredientDoc[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => {
              const isSelected = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={cn(
                    "flex items-center gap-1.5 border px-3 py-2 text-sm transition-colors",
                    isSelected
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border hover:border-fg"
                  )}
                >
                  {isSelected && <Check size={14} />}
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={() => onSubmit(Array.from(selected))}
        disabled={selected.size === 0}
        className="mt-4 w-full bg-fg py-3 font-bold text-bg disabled:opacity-30"
      >
        Find recipes ({selected.size} selected)
      </button>
    </div>
  );
}