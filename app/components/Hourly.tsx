import React, { useEffect, useState, useMemo } from "react";

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
}

export default function Hourly() {
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const API_KEY = useMemo(() => process.env.NEXT_PUBLIC_WEATHER_API_KEY, []);
  const CITY = "Bangkok";

  useEffect(() => {
    async function fetchForecast() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();
        if (data.list) {
          setForecast(data.list.slice(0, 6)); // ดึงข้อมูล 6 ชั่วโมงถัดไป
        }
      } catch (error) {
        console.error("Error fetching hourly forecast:", error);
      }
    }

    if (API_KEY) {
      fetchForecast();
    }
  }, [API_KEY]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Hourly Forecast</h2>
      {forecast.length > 0 ? (
        forecast.map((item, index) => (
          <div key={index} className="p-2 border-b">
            <p>{new Date(item.dt * 1000).toLocaleTimeString()}</p>
            <p>Temp: {item.main.temp}°C</p>
            <p>Humidity: {item.main.humidity}%</p>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
