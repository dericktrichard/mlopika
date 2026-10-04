// ---------- users/{userId} ----------
export type SubscriptionTier = "free" | "individual" | "family" | "b2b";

export interface UserDoc {
  uid: string;
  displayName: string;
  phoneNumber: string | null; // E.164 format, e.g. +2547XXXXXXXX
  email: string | null;
  createdAt: string; // ISO 8601
  subscriptionTier: SubscriptionTier;
  familyGroupId: string | null; // set if part of a Family Tier group
  // Denormalized pantry: a student's pantry is small (rarely >40 items)
  // and is read on nearly every app screen, so we keep it inline on the
  // user doc rather than as a subcollection -- one read instead of a
  // second query every single time we need it.
  pantryItemIds: string[]; // references into a shared `ingredients` collection
}

// ---------- ingredients/{ingredientId} ----------
// A shared master list (e.g. "ugali", "sukuma", "omena", "rice") so both
// user pantries and recipes reference the same canonical IDs -- this is
// what makes array-contains-any matching between the two possible at all.
export interface IngredientDoc {
  id: string;
  name: string;
  category: "staple" | "protein" | "vegetable" | "spice" | "dairy" | "other";
  localName?: string; // e.g. Swahili/Sheng term, for search/display
}

// ---------- recipes/{recipeId} ----------
export interface RecipeDoc {
  id: string;
  title: string;
  imageUrl?: string;
  ingredientIds: string[];
  requiredIngredientIds: string[]; 
  instructions: string[];
  dietTags: ("balanced" | "high-protein" | "vegetarian" | "quick" | "budget")[];
  macroProfile: {
    estimatedCalories: number;
    proteinGrams: number;
    carbGrams: number;
    fatGrams: number;
  };
  prepTimeMinutes: number;
  costTier: "low" | "medium" | "high"; // relative local cost, not KES amount (avoids re-editing every recipe on price shifts)
  originTag: "kenyan" | "international-budget";
}

// ---------- eateries/{eateryId} ----------
export interface EateryDoc {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    geohash: string; // enables range-query-based proximity search
  };
  address: string;
  priceRange: "low" | "medium" | "high";
  cuisineTags: string[];
  // Denormalized aggregate, updated via transaction whenever a review is
  // written -- avoids summing every review on every directory page load.
  ratingSummary: {
    averageRating: number;
    reviewCount: number;
  };
  isSponsored: boolean; // B2B promoted listing flag
  ownerId: string | null; // links to a `users` doc if the eatery owner has an account
}

// ---------- reviews/{reviewId} ----------
// Document ID is deliberately set to `${userId}_${eateryId}` at write time
// (not auto-generated) -- this makes "has this user already reviewed this
// place" a single doc lookup, and makes a duplicate review structurally
// impossible rather than something we have to check for.
export interface ReviewDoc {
  id: string; // `${userId}_${eateryId}`
  userId: string;
  eateryId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
}

// ---------- subscriptions/{userId} ----------
// Separate from UserDoc deliberately: this collection is written ONLY by
// the Paystack webhook handler via the Admin SDK (Step 9). The client
// Firestore rules for this collection will be read-only, never write --
// a user's own client code can NEVER grant itself a paid tier.
export interface SubscriptionDoc {
  userId: string;
  tier: SubscriptionTier;
  paystackCustomerCode: string;
  paystackSubscriptionCode: string | null;
  status: "active" | "cancelled" | "past_due" | "none";
  currentPeriodEnd: string | null; // ISO 8601
  linkedFamilyMemberIds: string[]; // for Family Tier, up to 6
  updatedAt: string;
}

export type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface WeeklyPlanDoc {
  id: string; // `${userId}_${weekStartDate}`
  userId: string;
  weekStartDate: string; // ISO date, the Monday of that week
  days: { day: WeekDay; recipeIds: string[] }[];
  updatedAt: string;
}