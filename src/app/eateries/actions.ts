"use server";

import { findNearbyEateries } from "@/lib/eateries/geo-query";
import { splitSponsored } from "@/lib/eateries/ranking";

export async function searchNearbyEateries(lat: number, lng: number) {
  const results = await findNearbyEateries([lat, lng], 5000);
  return splitSponsored(results);
}