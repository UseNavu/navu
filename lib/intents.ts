export type Intent = {
  categories: string[];
  confidence: number;
};

const rules = [
  { keywords: ["arroz", "feijão", "mercado", "comida", "comprar"], category: "mercado" },
  { keywords: ["gasolina", "gas", "etanol", "diesel", "posto"], category: "posto" },
  { keywords: ["remedio", "rem", "farmacia", "farm"], category: "farmácia" },
  { keywords: ["ração", "pet", "cachorro", "gato"], category: "pet" },
];

function matchScore(query: string, keyword: string): number {
  const q = query.toLowerCase();
  const k = keyword.toLowerCase();

  if (q === k) return 100;
  if (k.startsWith(q)) return 80; // incremental forte
  if (k.includes(q)) return 60;
  if (q.includes(k)) return 40;

  return 0;
}

export function detectIntent(query: string): Intent {
  const q = query.toLowerCase().trim();

  const scored: { category: string; score: number }[] = [];

  for (const rule of rules) {
    let best = 0;

    for (const keyword of rule.keywords) {
      const score = matchScore(q, keyword);
      if (score > best) best = score;
    }

    if (best > 0) {
      scored.push({ category: rule.category, score: best });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  const categories = scored.map((s) => s.category);
  const confidence = scored.length > 0 ? scored[0].score : 0;

  return {
    categories,
    confidence,
  };
}