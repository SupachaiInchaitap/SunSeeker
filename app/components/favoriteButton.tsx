"use client";

import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  city: string;
  lat: number;
  lon: number;
}

export default function FavoriteButton({ city, lat, lon }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem("supabase.auth.token");
        const authToken = token ? JSON.parse(token).currentSession.access_token : null;
        console.log("Auth Token:", authToken);

        if (!authToken) {
          console.warn("No auth token found.");
          return;
        }

        const res = await fetch(`/auth/favorite/add?city=${city}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to check favorite:", res.status, res.statusText);
          return;
        }

        const data = await res.json();
        console.log("Favorite Data:", data);
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Failed to check favorite:", error);
      }
    };

    checkFavorite();
  }, [city]);

  const handleFavorite = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("supabase.auth.token");
      const authToken = token ? JSON.parse(token).currentSession.access_token : null;

      if (!authToken) {
        console.warn("No auth token found. User might not be logged in.");
        alert("You must be logged in to add favorites.");
        setLoading(false);
        return;
      }

      const endpoint = "/auth/favorite/add";
      const method = isFavorite ? "DELETE" : "POST";
      const body = JSON.stringify({ city, lat, lon });

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: method === "POST" ? body : JSON.stringify({ city }),
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
      setLoading(false); // Ensure loading state is always reset
    }
  };

  return (
    <button
      onClick={handleFavorite}
      className={`mt-4 px-4 py-2 rounded-lg shadow-md transition-colors duration-300 ${
        isFavorite ? "bg-red-500 text-white" : "bg-gray-300 text-gray-800"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={loading} // Only disable when loading
    >
      {loading ? "Loading..." : isFavorite ? "Remove from Favorites" : "Add to Favorites"}
    </button>
  );
}
