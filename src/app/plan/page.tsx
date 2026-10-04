import { Header } from "@/components/layout/header";
import { Container } from "@/components/layout/container";
import { PlanClient } from "./plan-client";
import { getAllRecipes } from "./actions";
import type { WeeklyPlanDoc } from "@/lib/types/schema";

function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().split("T")[0];
}

export default async function PlanPage() {
  const recipes = await getAllRecipes();
  const weekStartDate = getCurrentWeekStart();

  const emptyPlan: WeeklyPlanDoc = {
    id: `local_${weekStartDate}`,
    userId: "local",
    weekStartDate,
    days: [
      { day: "mon", recipeIds: [] }, { day: "tue", recipeIds: [] },
      { day: "wed", recipeIds: [] }, { day: "thu", recipeIds: [] },
      { day: "fri", recipeIds: [] }, { day: "sat", recipeIds: [] },
      { day: "sun", recipeIds: [] },
    ],
    updatedAt: new Date().toISOString(),
  };

  return (
    <>
      <Header />
      <main>
        <Container className="py-12">
          <h1 className="mb-6 text-2xl font-bold">Your week</h1>
          <PlanClient initialPlan={emptyPlan} allRecipes={recipes} />
        </Container>
      </main>
    </>
  );
}