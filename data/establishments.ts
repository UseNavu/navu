export type Establishment = {
  id: number;
  name: string;
  category: string;
  distance: string;

  // 🌍 NOVO (simulado por enquanto)
  lat: number;
  lng: number;
};

export const establishments: Establishment[] = [
  {
    id: 1,
    name: "Supermercado Central",
    category: "mercado",
    distance: "0.8 km",
    lat: -23.268,
    lng: -47.678,
  },
  {
    id: 2,
    name: "Farmácia São João",
    category: "farmácia",
    distance: "1.2 km",
    lat: -23.271,
    lng: -47.682,
  },
  {
    id: 3,
    name: "Posto Shell BR",
    category: "posto",
    distance: "1.5 km",
    lat: -23.275,
    lng: -47.690,
  },
  {
    id: 4,
    name: "Mercado Bom Preço",
    category: "mercado",
    distance: "2.1 km",
    lat: -23.280,
    lng: -47.700,
  },
  {
    id: 5,
    name: "Drogasil Centro",
    category: "farmácia",
    distance: "2.4 km",
    lat: -23.285,
    lng: -47.710,
  },
];