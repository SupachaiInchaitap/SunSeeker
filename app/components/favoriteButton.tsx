"use client";

import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  city: string;
  lat: number;
  lon: number;
  user: {
    id: string;
  } | null;
}

export default function FavoriteButton({ city, lat, lon, user }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return; // Don't check if not authenticated

      try {
        const res = await fetch(`/auth/favorite/add?city=${city}`, {
          credentials: "include",
        });

        if (!res.ok) {
          console.error("Failed to check favorite:", res.status, res.statusText);
          return;
        }

        const data = await res.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Failed to check favorite:", error);
      }
    };

    checkFavorite();
  }, [city, user]);

  const handleFavorite = async () => {
    if (!user) {
      alert("Please log in to add to favorites.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = "/auth/favorite/add";
      const method = isFavorite ? "DELETE" : "POST";
      const body = JSON.stringify({ city, lat, lon });

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method === "POST" ? body : JSON.stringify({ city }),
        credentials: "include",
      });

      if (!res.ok) {
        console.error(`Failed to update favorite (${method}):`, res.status, res.statusText);
        alert("Failed to update favorite. Please try again later.");
        setLoading(false);
        return;
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to update favorite:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      className={`mt-4 px-6 py-3 rounded-full shadow-lg font-semibold text-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
        isFavorite
          ? "bg-red-500 text-white hover:bg-red-600" // Remove from favorites (red background, white text)
          : "bg-white text-gray-800 hover:bg-gray-100" // Add to favorites (white background)
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={loading}
    >
      {loading ? "Loading..." : isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
}
