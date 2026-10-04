import type { EateryWithDistance } from "./geo-query";

const DISTANCE_WEIGHT = 0.5;
const RATING_WEIGHT = 0.5;
const MAX_REASONABLE_DISTANCE_KM = 5;

function normalizeDistance(distanceKm: number): number {
  const clamped = Math.min(distanceKm, MAX_REASONABLE_DISTANCE_KM);
  return 1 - clamped / MAX_REASONABLE_DISTANCE_KM;
}

function normalizeRating(averageRating: number): number {
  return averageRating / 5;
}

export function rankEateries(results: EateryWithDistance[]): EateryWithDistance[] {
  return [...results].sort((a, b) => {
    const scoreA =
      normalizeDistance(a.distanceKm) * DISTANCE_WEIGHT +
      normalizeRating(a.eatery.ratingSummary.averageRating) * RATING_WEIGHT;
    const scoreB =
      normalizeDistance(b.distanceKm) * DISTANCE_WEIGHT +
      normalizeRating(b.eatery.ratingSummary.averageRating) * RATING_WEIGHT;
    return scoreB - scoreA;
  });
}

export function splitSponsored(results: EateryWithDistance[]) {
  return {
    sponsored: results.filter((r) => r.eatery.isSponsored),
    organic: rankEateries(results.filter((r) => !r.eatery.isSponsored)),
  };
}