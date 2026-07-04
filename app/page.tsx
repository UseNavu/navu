"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { establishments } from "@/data/establishments";
import { searchEstablishments } from "@/lib/search";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

type UserLocation = {
  lat: number;
  lng: number;
} | null;

export default function Home() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] =
    useState<typeof establishments>(establishments);

  const [location, setLocation] = useState<UserLocation>(null);

  const [selected, setSelected] = useState<number | null>(null);
  const [activeRoute, setActiveRoute] = useState<number | null>(null);

  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  /* ---------------- GPS ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
    });

    const watch = navigator.geolocation.watchPosition((pos) => {
      setUserPos([pos.coords.latitude, pos.coords.longitude]);
    });

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  /* ---------------- SEARCH ---------------- */
  function handleSearch(value: string) {
    setSearch(value);

    if (!value.trim()) {
      setFiltered(establishments);
      return;
    }

    const results = searchEstablishments(
      value,
      establishments,
      location
    );

    setFiltered(results);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* HEADER */}
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold">Navu</h1>
        <p className="text-zinc-400">
          Descoberta inteligente de comércios locais
        </p>
      </div>

      {/* SEARCH */}
      <div className="px-6 pb-4">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="O que você quer encontrar?"
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800"
        />
      </div>

      {/* MAPA */}
      <div className="px-6 pb-4">
        <div className="h-[280px] w-full rounded-xl overflow-hidden border border-zinc-800">
          <Map
            selected={selected}
            activeRoute={activeRoute}
            userPos={userPos}
          />
        </div>
      </div>

      {/* LISTA */}
      <div className="flex-1 overflow-auto px-6 py-4 space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition ${
              selected === item.id
                ? "bg-zinc-800 border-white"
                : "bg-zinc-900 border-zinc-800"
            }`}
          >
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-zinc-400 mb-3">
              {item.category}
            </p>

            {/* BOTÃO IR ATÉ LÁ */}
            <button
              onClick={() => {
                setSelected(item.id);
                setActiveRoute(item.id);
              }}
              className="px-3 py-2 text-sm bg-blue-600 rounded-lg hover:bg-blue-500 transition"
            >
              Ir até lá
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}