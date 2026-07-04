export type Intent = {
  categories: string[];
  confidence: number;
};

const rules = [
  {
    keywords: ["arroz", "feijão", "mercado", "comida", "comprar", "supermercado"],
    category: "mercado",
  },
  {
    keywords: ["gasolina", "gas", "etanol", "diesel", "posto", "combustível"],
    category: "posto",
  },
  {
    keywords: ["remedio", "remédios", "farmacia", "farmácia", "droga"],
    category: "farmacia",
  },
  {
    keywords: ["ração", "pet", "cachorro", "gato", "animal"],
    category: "agro",
  },
  {
    keywords: ["padaria", "pão", "bolo", "café"],
    category: "padaria",
  },
];

function normalize(text: string) {
  return text.toLowerCase().trim();
}

function matchScore(query: string, keyword: string): number {
  const q = normalize(query);
  const k = normalize(keyword);

  if (q === k) return 100;
  if (q.includes(k)) return 90;
  if (k.includes(q)) return 70;

  return 0;
}

export function detectIntent(query: string): Intent {
  const q = normalize(query);

  const scored: { category: string; score: number }[] = [];

  for (const rule of rules) {
    let best = 0;

    for (const keyword of rule.keywords) {
      const score = matchScore(q, keyword);
      if (score > best) best = score;
    }

    if (best > 0) {
      scored.push({
        category: rule.category,
        score: best,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  // 🔥 fallback inteligente (MUITO IMPORTANTE)
  const top = scored[0];

  return {
    categories: scored.map((s) => s.category),
    confidence: top ? top.score : 0,
  };
}