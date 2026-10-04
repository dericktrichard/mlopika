import { adminDb } from "@/lib/firebase/admin-core";
import type { IngredientDoc, RecipeDoc } from "@/lib/types/schema";

const ingredients: IngredientDoc[] = [
  { id: "ugali-flour", name: "Maize flour (ugali)", category: "staple" },
  { id: "sukuma-wiki", name: "Sukuma wiki", category: "vegetable" },
  { id: "omena", name: "Omena (dried silver fish)", category: "protein" },
  { id: "beans", name: "Beans", category: "protein" },
  { id: "rice", name: "Rice", category: "staple" },
  { id: "chapati-flour", name: "Wheat flour (chapati)", category: "staple" },
  { id: "onion", name: "Onion", category: "vegetable" },
  { id: "tomato", name: "Tomato", category: "vegetable" },
  { id: "cooking-oil", name: "Cooking oil", category: "other" },
  { id: "salt", name: "Salt", category: "spice" },
  { id: "eggs", name: "Eggs", category: "protein" },
  { id: "pasta", name: "Pasta", category: "staple" },
];

const recipes: RecipeDoc[] = [
  {
    id: "ugali-sukuma-omena",
    title: "Ugali with Sukuma Wiki and Omena",
    imageUrl: "https://images.pexels.com/photos/37100094/pexels-photo-37100094.jpeg",
    ingredientIds: ["ugali-flour", "sukuma-wiki", "omena", "onion", "tomato", "cooking-oil", "salt"],
    requiredIngredientIds: ["ugali-flour", "sukuma-wiki"],
    instructions: [
      "Boil water and stir in maize flour gradually to form ugali.",
      "Fry onion and tomato, add sukuma wiki and omena, season with salt.",
      "Serve ugali alongside the sukuma and omena.",
    ],
    dietTags: ["balanced", "budget"],
    macroProfile: { estimatedCalories: 520, proteinGrams: 22, carbGrams: 68, fatGrams: 14 },
    prepTimeMinutes: 35,
    costTier: "low",
    originTag: "kenyan",
  },
  {
    id: "beans-rice",
    title: "Beans and Rice",
    imageUrl: "https://images.pexels.com/photos/31302309/pexels-photo-31302309.jpeg",
    ingredientIds: ["beans", "rice", "onion", "tomato", "cooking-oil", "salt"],
    requiredIngredientIds: ["beans", "rice"],
    instructions: [
      "Cook beans until soft, or use pre-cooked beans.",
      "Fry onion and tomato, combine with beans into a stew.",
      "Serve over cooked rice.",
    ],
    dietTags: ["balanced", "vegetarian", "budget"],
    macroProfile: { estimatedCalories: 480, proteinGrams: 18, carbGrams: 85, fatGrams: 9 },
    prepTimeMinutes: 40,
    costTier: "low",
    originTag: "kenyan",
  },
  {
    id: "egg-chapati-wrap",
    title: "Chapati Egg Wrap",
    imageUrl: "https://images.pexels.com/photos/12737663/pexels-photo-12737663.jpeg",
    ingredientIds: ["chapati-flour", "eggs", "onion", "cooking-oil", "salt"],
    requiredIngredientIds: ["chapati-flour", "eggs"],
    instructions: [
      "Make chapati dough, roll thin, cook on a hot pan.",
      "Scramble eggs with onion and salt.",
      "Wrap the egg mixture inside the chapati.",
    ],
    dietTags: ["quick", "budget"],
    macroProfile: { estimatedCalories: 410, proteinGrams: 16, carbGrams: 48, fatGrams: 17 },
    prepTimeMinutes: 20,
    costTier: "low",
    originTag: "kenyan",
  },
  {
    id: "simple-pasta",
    title: "Tomato Onion Pasta",
    imageUrl: "https://images.pexels.com/photos/7401/pexels-photo.jpg",
    ingredientIds: ["pasta", "onion", "tomato", "cooking-oil", "salt"],
    requiredIngredientIds: ["pasta"],
    instructions: [
      "Boil pasta until al dente.",
      "Fry onion and tomato into a light sauce, season with salt.",
      "Toss pasta through the sauce.",
    ],
    dietTags: ["quick", "vegetarian", "budget"],
    macroProfile: { estimatedCalories: 450, proteinGrams: 11, carbGrams: 80, fatGrams: 10 },
    prepTimeMinutes: 20,
    costTier: "low",
    originTag: "international-budget",
  },
];

async function seed() {
  const batch = adminDb.batch();

  for (const ingredient of ingredients) {
    batch.set(adminDb.collection("ingredients").doc(ingredient.id), ingredient);
  }
  for (const recipe of recipes) {
    batch.set(adminDb.collection("recipes").doc(recipe.id), recipe);
  }

  await batch.commit();
  console.log(`Seeded ${ingredients.length} ingredients and ${recipes.length} recipes.`);
}

seed().catch(console.error);