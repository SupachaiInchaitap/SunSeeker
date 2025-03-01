// app/components/ProfileTabs.tsx

"use client";

import { useState, Suspense } from "react";
import CurrentWeather from "./CurrentWeather";
import TemperatureGraphWrapper from "./TemperatureChartBox";

interface City {
  city_name: string;
  lat: number;
  lon: number;
}

interface ProfileTabsProps {
  favoriteCities: City[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  graphData: any[];
}

export default function ProfileTabs({ favoriteCities, graphData }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("favorites");

  return (
    <div>
      <div className="border-b border-gray-200">
        <ul className="flex space-x-4">
          <li
            className={`cursor-pointer text-xl font-semibold ${
              activeTab === "favorites"
                ? "text-blue-500 border-b-4 border-blue-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites
          </li>
          <li
            className={`cursor-pointer text-xl font-semibold ${
              activeTab === "graph"
                ? "text-blue-500 border-b-4 border-blue-500"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("graph")}
          >
            Temperature Graph
          </li>
        </ul>
      </div>

      <div className="mt-6">
        {activeTab === "favorites" && (
          <div className="space-y-4">
            {favoriteCities.length > 0 ? (
              favoriteCities.map((city, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl shadow hover:shadow-lg transition duration-300"
                >
                  <h3 className="text-2xl font-bold text-gray-800">{city.city_name}</h3>
                  <Suspense fallback={<p>Loading weather...</p>}>
                    <CurrentWeather lat={city.lat} lon={city.lon} />
                  </Suspense>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No favorites added yet.</p>
            )}
          </div>
        )}

        {activeTab === "graph" && (
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Temperature Graph</h3>
            <Suspense fallback={<p>Loading graph...</p>}>
              <TemperatureGraphWrapper graphData={graphData} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}
