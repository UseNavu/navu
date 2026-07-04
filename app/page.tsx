"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { establishments } from "@/data/establishments";
import { searchEstablishments } from "@/lib/search";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function Home() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(establishments);
  const [userPos, setUserPos] =
    useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition((pos) => {
      setUserPos([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  function handleSearch(value: string) {
    setSearch(value);

    if (!value.trim()) {
      setFiltered(establishments);
      return;
    }

    const results = searchEstablishments(
      value,
      establishments,
      null
    );

    setFiltered(results);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">

      <div className="text-center py-6">
        <h1 className="text-4xl font-bold">Navu</h1>
      </div>

      <div className="px-6 pb-4">
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl"
        />
      </div>

      <div className="px-6 pb-4">
        <div className="h-[300px] rounded-xl overflow-hidden border border-zinc-800">
          <Map userPos={userPos} />
        </div>
      </div>

      <div className="px-6 space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl"
          >
            {item.name}
          </div>
        ))}
      </div>
    </main>
  );
}