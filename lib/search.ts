import { Establishment } from "@/data/establishments";
import { detectIntent } from "@/lib/intents";
import { getDistanceKm } from "@/lib/distance";

type UserLocation = {
  lat: number;
  lng: number;
} | null;

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function scoreItem(
  query: string,
  item: Establishment,
  location: UserLocation
): number {
  const intent = detectIntent(query);

  const q = normalize(query);
  const name = item.name.toLowerCase();
  const category = item.category.toLowerCase();

  let score = 0;

  // 🎯 INTENÇÃO
  if (intent.categories.includes(category)) {
    score += 200;
  }

  // 🔎 TEXTO
  if (name.startsWith(q)) score += 120;
  else if (name.includes(q)) score += 60;

  if (category.includes(q)) score += 40;

  // 🌍 GPS REAL
  if (location) {
    const distance = getDistanceKm(location, item);

    if (distance < 1) score += 120;
    else if (distance < 2) score += 80;
    else if (distance < 5) score += 40;
  }

  return score;
}

export function searchEstablishments(
  query: string,
  data: Establishment[],
  location: UserLocation
): Establishment[] {
  const q = normalize(query);

  if (!q) return [];

  return data
    .map((item) => ({
      item,
      score: scoreItem(q, item, location),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item);
}