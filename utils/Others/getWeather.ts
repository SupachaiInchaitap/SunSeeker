export async function getWeatherData(lat: number, lon: number, type: "current" | "historical", timestamp?: number) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  if (type === "current") {
    // Fetch current weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch current weather data");
    }

    const weatherData = await weatherResponse.json();

    // Try to fetch air quality data
    let airQualityData = null;
    try {
      const airQualityResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );

      if (airQualityResponse.ok) {
        const airQualityJson = await airQualityResponse.json();
        airQualityData = airQualityJson.list[0].main;
      }
    } catch (error) {
      console.error("Failed to fetch air quality data:", error);
    }

    return {
      main: weatherData.main,
      wind: weatherData.wind,
      airQuality: airQualityData || { aqi: "N/A" },
      name: weatherData.name,
      coord: weatherData.coord,
    };
  }

  if (type === "historical" && timestamp) {
    // Fetch historical weather data
    const historicalResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${timestamp}&appid=${apiKey}&units=metric`
    );

    if (!historicalResponse.ok) {
      throw new Error("Failed to fetch historical weather data");
    }

    const historicalData = await historicalResponse.json();

    // Extract relevant temperature data for the graph
    interface HourlyData {
      dt: number;
      temp: number;
    }
    
    const temperatureHistory = historicalData.hourly.map((hour: HourlyData) => ({
      time: new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: hour.temp,
    }));

    return temperatureHistory;
  }
}
