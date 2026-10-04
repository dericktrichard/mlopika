import * as geofire from "geofire-common";
import { adminDb } from "@/lib/firebase/admin";
import type { EateryDoc } from "@/lib/types/schema";

export interface EateryWithDistance {
  eatery: EateryDoc;
  distanceKm: number;
}

export async function findNearbyEateries(
  center: [number, number],
  radiusInM: number
): Promise<EateryWithDistance[]> {
  const bounds = geofire.geohashQueryBounds(center, radiusInM);

  const batchResults = await Promise.all(
    bounds.map(([start, end]) =>
      adminDb
        .collection("eateries")
        .orderBy("location.geohash")
        .startAt(start)
        .endAt(end)
        .get()
    )
  );

  const candidates = new Map<string, EateryDoc>();
  for (const snapshot of batchResults) {
    for (const docSnap of snapshot.docs) {
      candidates.set(docSnap.id, { id: docSnap.id, ...docSnap.data() } as EateryDoc);
    }
  }

  const withDistance: EateryWithDistance[] = [];
  for (const eatery of candidates.values()) {
    const distanceKm = geofire.distanceBetween(
      [eatery.location.lat, eatery.location.lng],
      center
    );
    if (distanceKm * 1000 <= radiusInM) {
      withDistance.push({ eatery, distanceKm });
    }
  }

  return withDistance;
}