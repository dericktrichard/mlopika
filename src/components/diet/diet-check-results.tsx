import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DietValidationResult } from "@/lib/diet/diet-validator";

const LABELS: Record<string, string> = {
  "balanced-macros": "Balanced macronutrients",
  "adequate-calories": "Adequate calories",
  varied: "Meal variety",
};

export function DietCheckResults({ result }: { result: DietValidationResult }) {
  return (
    <div className="border border-border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold">Weekly diet check</h3>
        <span
          className={cn(
            "px-2 py-0.5 text-xs font-bold",
            result.overallBalanced ? "bg-accent text-accent-fg" : "bg-danger text-white"
          )}
        >
          {result.overallBalanced ? "Balanced" : "Needs attention"}
        </span>
      </div>
      <ul className="space-y-2">
        {result.checks.map((check) => (
          <li key={check.id} className="flex items-start gap-2 text-sm">
            {check.passed ? (
              <Check size={16} className="mt-0.5 shrink-0 text-accent" />
            ) : (
              <X size={16} className="mt-0.5 shrink-0 text-danger" />
            )}
            <span>
              <span className="font-medium">{LABELS[check.id]}:</span> {check.detail}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        This is general nutritional guidance based on published dietary ranges, not personalized medical advice.
      </p>
    </div>
  );
}