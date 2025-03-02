"use client";

import { BsSearch } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchBarProps {
  initialCity?: string;
  targetPage?: string;
}

export default function SearchBar({ initialCity = "Bangkok", targetPage = "/" }: SearchBarProps) {
  const [city, setCity] = useState(initialCity);
  const router = useRouter();

  // Update the URL when the form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${targetPage}?q=${city}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center space-x-2 bg-white text-black rounded-full px-4 py-2 shadow-inner w-60 md:w-72 lg:w-96">
        <BsSearch size={20} className="text-gray-500" />
        <input
          type="text"
          name="q"
          className="outline-none bg-transparent w-full placeholder-gray-400"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
    </form>
  );
}