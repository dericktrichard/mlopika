"use client";

import { useState } from "react";
import { MapPin, Star, Megaphone } from "lucide-react";
import { searchNearbyEateries } from "./actions";
import type { EateryWithDistance } from "@/lib/eateries/geo-query";

export function EateryClient() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [sponsored, setSponsored] = useState<EateryWithDistance[]>([]);
  const [organic, setOrganic] = useState<EateryWithDistance[]>([]);

  function requestLocation() {
    setStatus("loading");
    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { sponsored, organic } = await searchNearbyEateries(
          position.coords.latitude,
          position.coords.longitude
        );
        setSponsored(sponsored);
        setOrganic(organic);
        setStatus("idle");
      },
      () => setStatus("error")
    );
  }

  if (status === "idle" && sponsored.length === 0 && organic.length === 0) {
    return (
      <button onClick={requestLocation} className="flex items-center gap-2 bg-fg px-4 py-3 font-bold text-bg">
        <MapPin size={16} /> Find eateries near me
      </button>
    );
  }

  if (status === "loading") return <p className="text-muted">Finding your location...</p>;
  if (status === "error") return <p className="text-danger">Couldn&apos;t get your location. Check your browser permissions.</p>;

  return (
    <div className="space-y-6">
      {sponsored.length > 0 && (
        <div>
          <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
            <Megaphone size={13} /> Promoted
          </h2>
          <div className="space-y-2">
            {sponsored.map(({ eatery, distanceKm }) => (
              <EateryRow key={eatery.id} eatery={eatery} distanceKm={distanceKm} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Nearby</h2>
        <div className="space-y-2">
          {organic.map(({ eatery, distanceKm }) => (
            <EateryRow key={eatery.id} eatery={eatery} distanceKm={distanceKm} />
          ))}
        </div>
      </div>
    </div>
  );
}

function EateryRow({ eatery, distanceKm }: { eatery: EateryWithDistance["eatery"]; distanceKm: number }) {
  return (
    <div className="flex items-center justify-between border border-border p-3">
      <div>
        <h3 className="font-bold">{eatery.name}</h3>
        <p className="text-xs text-muted">{eatery.address}</p>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span className="flex items-center gap-1">
          <Star size={14} className="text-accent" /> {eatery.ratingSummary.averageRating.toFixed(1)}
        </span>
        <span className="text-muted">{distanceKm.toFixed(1)} km</span>
      </div>
    </div>
  );
}