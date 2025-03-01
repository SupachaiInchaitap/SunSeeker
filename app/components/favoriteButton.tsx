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
      className={`mt-4 px-4 py-2 rounded-lg shadow-md transition-colors duration-300 ${
        isFavorite ? "bg-red-500 text-white" : "bg-gray-300 text-gray-800"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={loading}
    >
      {loading ? "Loading..." : isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
}
