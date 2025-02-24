export async function getWeatherData(city: string) {
    const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  
    // Fetch weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
  
    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }
  
    const weatherData = await weatherResponse.json();
  
    // Try to fetch air quality data
    let airQualityData = null;
    try {
      const airQualityResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`
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
  