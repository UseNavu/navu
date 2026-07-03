"use client";

import { useEffect, useState } from "react";
import { establishments } from "@/data/establishments";
import { searchEstablishments } from "@/lib/search";

type UserLocation = {
  lat: number;
  lng: number;
} | null;

export default function Home() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(establishments);
  const [location, setLocation] = useState<UserLocation>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // 🌍 pega GPS real
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoadingLocation(false);
      },
      () => {
        // usuário negou permissão
        setLocation(null);
        setLoadingLocation(false);
      }
    );
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
    setFiltered(searchEstablishments(value, establishments, location));
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-6">
      {/* TITLE */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold tracking-tight">Navu</h1>
        <p className="text-zinc-400 mt-2">
          Encontre o que precisa perto de você
        </p>

        {/* STATUS GPS */}
        <p className="text-xs text-zinc-500 mt-2">
          {loadingLocation
            ? "Detectando sua localização..."
            : location
            ? "📍 Localização ativa"
            : "📍 Localização não disponível"}
        </p>
      </div>

      {/* SEARCH */}
      <div className="w-full max-w-xl">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="O que você quer encontrar?"
          className="w-full px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-zinc-600"
        />
      </div>

      {/* RESULTS */}
      {search.trim().length > 0 && (
        <div className="w-full max-w-xl mt-8 space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-zinc-400">{item.category}</p>
                </div>

                <span className="text-sm text-zinc-500">
                  {item.distance}
                </span>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-sm text-center">
              Nenhum resultado encontrado
            </p>
          )}
        </div>
      )}
    </main>
  );
}