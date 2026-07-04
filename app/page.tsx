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
  const [filtered, setFiltered] = useState<typeof establishments | null>(null);
  const [location, setLocation] = useState<UserLocation>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  // 📍 GPS
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

  function handleSearch(value: string) {
    setSearch(value);

    if (!value.trim()) {
      setFiltered(null);
      setSelected(null);
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
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800
          focus:border-white focus:outline-none transition-all duration-300"
        />
      </div>

      {/* MAPA */}
      {selected && (
        <div className="px-6 pb-4">
          <div className="h-[280px] w-full rounded-xl overflow-hidden border border-zinc-800 animate-fade-in">
            <Map
              selected={selected}
              onSelect={setSelected}
              userPos={userPos}
            />
          </div>
        </div>
      )}

      {/* LISTA */}
      {filtered && (
        <div className="flex-1 overflow-auto px-6 py-4 space-y-3 animate-fade-in">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`group p-4 rounded-xl border cursor-pointer transition-all duration-300
                ${
                  selected === item.id
                    ? "bg-zinc-800 border-white shadow-lg scale-[1.02]"
                    : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:scale-[1.01]"
                }`}
              >
                <p className="font-medium group-hover:text-white transition">
                  {item.name}
                </p>
                <p className="text-sm text-zinc-400">
                  {item.category}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-zinc-500 py-10 animate-fade-in">
              Nenhum resultado encontrado
            </div>
          )}
        </div>
      )}

    </main>
  );
}