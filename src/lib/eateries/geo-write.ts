import * as geofire from "geofire-common";

export function withGeohash(lat: number, lng: number) {
  return {
    lat,
    lng,
    geohash: geofire.geohashForLocation([lat, lng]),
  };
}