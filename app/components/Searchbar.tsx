"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";

export default function SearchBar({ targetPage = "/" }: { targetPage?: string }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${targetPage}?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex items-center space-x-2 bg-white text-black rounded-full px-4 py-2 shadow-inner w-60 md:w-72 lg:w-96">
        <BsSearch size={20} className="text-gray-500" />
        <input
          type="text"
          className="outline-none bg-transparent w-full placeholder-gray-400"
          placeholder="Search city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </form>
  );
}
