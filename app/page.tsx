"use client";

import { useEffect, useState } from "react";
import { establishments } from "@/data/establishments";
import { searchEstablishments } from "@/lib/search";
import Map from "@/components/Map";

type UserLocation = {
  lat: number;
  lng: number;
} | null;

export default function Home() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(establishments);
  const [location, setLocation] = useState<UserLocation>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // GPS
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
        setLocation(null);
        setLoadingLocation(false);
      }
    );
  }, []);

  function handleSearch(value: string) {
    setSearch(value);

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
        <p className="text-zinc-400">Encontre comércios perto de você</p>
      </div>

      {/* SEARCH */}
      <div className="px-6 pb-4">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="O que você quer encontrar?"
          className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800"
        />
      </div>

      {/* MAP */}
      <div className="h-[400px] w-full">
        <Map />
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-auto px-6 py-4 space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-zinc-400">{item.category}</p>
          </div>
        ))}
      </div>
    </main>
  );
}