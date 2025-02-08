import React, { useEffect, useState } from 'react';

export default function Today() {
  interface WeatherData {
    main: {
      temp: number;
      humidity: number;
    };
    wind: {
      speed: number;
    };
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const today = new Date();
  const date = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const apiKey = 'fb51b1f91915acacd0912b0e3a7d6857'; // Your actual API key
    const city = 'Bangkok'; // Your actual city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
      })
      .catch(error => console.error('Error fetching weather data:', error));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Today Weather</h2>
      <p className="text-lg">{date}</p>
      <p className="mt-2">The weather tonight is expected to be clear with a low of 15°C.</p>
      {weather ? (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-md">
          <p className="text-lg">Current Temperature: {weather.main.temp}°C</p>
          <p className="text-lg">Humidity: {weather.main.humidity}%</p>
          <p className="text-lg">Wind Speed: {weather.wind.speed} km/h</p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}
    </div>
  );
}