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
  const q = normalize(query);
  const name = item.name.toLowerCase();
  const category = item.category.toLowerCase();

  const intent = detectIntent(q);

  let score = 0;

  // 🎯 1. INTENÇÃO (MAIOR PESO)
  if (intent.categories?.includes(category)) {
    score += 200;
  }

  // 🔎 2. MATCH TEXTO (NOME)
  if (name.startsWith(q)) {
    score += 120;
  } else if (name.includes(q)) {
    score += 60;
  }

  // 🔎 3. MATCH CATEGORIA
  if (category.includes(q)) {
    score += 40;
  }

  // 🌍 4. GPS REAL
  if (location) {
    const distance = getDistanceKm(location, item);

    if (distance < 1) score += 120;
    else if (distance < 2) score += 80;
    else if (distance < 5) score += 40;
    else if (distance < 10) score += 10;
  }

  return score;
}

export function searchEstablishments(
  query: string,
  data: Establishment[],
  location: UserLocation
): Establishment[] {
  const q = normalize(query);

  if (!q) return data; // 🔥 IMPORTANTE: não sumir tudo

  return data
    .map((item) => ({
      item,
      score: scoreItem(q, item, location),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((x) => x.score >= 20) // 🔥 filtro menos agressivo
    .map((x) => x.item);
}