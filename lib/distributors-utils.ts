import type { Distributor } from "@/data/distributors";

export type CityGroup = {
  city: string;
  distributors: Distributor[];
};

export type StateBucket = {
  state: string;
  count: number;
  cityCount: number;
  cities: CityGroup[];
};

export function groupByStateAndCity(
  distributors: Distributor[]
): StateBucket[] {
  // Group by state first
  const stateMap = new Map<string, Distributor[]>();
  for (const d of distributors) {
    if (!stateMap.has(d.state)) stateMap.set(d.state, []);
    stateMap.get(d.state)!.push(d);
  }

  const buckets: StateBucket[] = [];
  for (const [state, distList] of stateMap) {
    const cityMap = new Map<string, Distributor[]>();
    for (const d of distList) {
      if (!cityMap.has(d.city)) cityMap.set(d.city, []);
      cityMap.get(d.city)!.push(d);
    }
    const cities: CityGroup[] = Array.from(cityMap.entries())
      .map(([city, dist]) => ({ city, distributors: dist }))
      .sort((a, b) => b.distributors.length - a.distributors.length);
    buckets.push({
      state,
      count: distList.length,
      cityCount: cities.length,
      cities,
    });
  }
  return buckets.sort((a, b) => b.count - a.count);
}

export function getTopCities(
  distributors: Distributor[],
  limit = 5
): { city: string; state: string; count: number }[] {
  const map = new Map<string, { city: string; state: string; count: number }>();
  for (const d of distributors) {
    const key = `${d.city}|${d.state}`;
    if (!map.has(key)) {
      map.set(key, { city: d.city, state: d.state, count: 0 });
    }
    map.get(key)!.count++;
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Approximate geographic coordinates for each state's "center" pin on our
// constellation SVG. Numbers are SVG x/y within the 600 x 420 viewbox.
export const STATE_POSITIONS: Record<
  string,
  { x: number; y: number; label: string }
> = {
  "Arunachal Pradesh": { x: 460, y: 80, label: "Arunachal" },
  Nagaland: { x: 500, y: 175, label: "Nagaland" },
  Manipur: { x: 485, y: 245, label: "Manipur" },
  Mizoram: { x: 440, y: 310, label: "Mizoram" },
  Tripura: { x: 355, y: 320, label: "Tripura" },
  Meghalaya: { x: 280, y: 250, label: "Meghalaya" },
  Assam: { x: 360, y: 175, label: "Assam" },
  "West Bengal": { x: 140, y: 230, label: "W. Bengal" },
  Bihar: { x: 75, y: 130, label: "Bihar" },
  Odisha: { x: 130, y: 360, label: "Odisha" },
};
