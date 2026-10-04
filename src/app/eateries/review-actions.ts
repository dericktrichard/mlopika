"use server";

import { adminDb } from "@/lib/firebase/admin";
import type { ReviewDoc } from "@/lib/types/schema";

export async function submitReview(
  userId: string,
  eateryId: string,
  rating: 1 | 2 | 3 | 4 | 5,
  comment: string
) {
  const reviewId = `${userId}_${eateryId}`;
  const reviewRef = adminDb.collection("reviews").doc(reviewId);
  const eateryRef = adminDb.collection("eateries").doc(eateryId);

  await adminDb.runTransaction(async (tx) => {
    const existing = await tx.get(reviewRef);
    if (existing.exists) {
      throw new Error("You've already reviewed this eatery.");
    }

    const eaterySnap = await tx.get(eateryRef);
    if (!eaterySnap.exists) {
      throw new Error("Eatery not found.");
    }

    const current = eaterySnap.data()!.ratingSummary as { averageRating: number; reviewCount: number };
    const newCount = current.reviewCount + 1;
    const newAverage = (current.averageRating * current.reviewCount + rating) / newCount;

    const review: ReviewDoc = {
      id: reviewId,
      userId,
      eateryId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    tx.set(reviewRef, review);
    tx.update(eateryRef, {
      "ratingSummary.averageRating": newAverage,
      "ratingSummary.reviewCount": newCount,
    });
  });
}