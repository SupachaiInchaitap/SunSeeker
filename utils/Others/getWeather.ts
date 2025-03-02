/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/utils/Others/getWeather.ts
export async function getWeatherData(
  lat: number,
  lon: number,
  type: "current" | "historical" | "airQualityForecast",
  timestamp?: number
) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  // Fetch Current Weather Data
  if (type === "current") {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      if (!weatherResponse.ok) {
        console.error("Response Status:", weatherResponse.status);
        const errorText = await weatherResponse.text();
        console.error("Error Response Text:", errorText);
        throw new Error("Failed to fetch current weather data");
      }

      const weatherData = await weatherResponse.json();

      // Fetch Air Quality Data
      const airQuality = await getAirQuality(lat, lon);

      // Extract relevant data for the current weather
      return {
        temp: weatherData.main.temp,
        feels_like: weatherData.main.feels_like, // Feels like temperature
        temp_min: weatherData.main.temp_min, // Min temperature
        temp_max: weatherData.main.temp_max, // Max temperature
        pressure: weatherData.main.pressure, // Pressure
        humidity: weatherData.main.humidity, // Humidity
        visibility: weatherData.visibility, // Visibility
        wind_speed: weatherData.wind.speed,
        wind_gust: weatherData.wind.gust || 0, // Wind Gust
        clouds: weatherData.clouds.all, // Cloud coverage
        sunrise: weatherData.sys.sunrise, // Sunrise time
        sunset: weatherData.sys.sunset, // Sunset time
        aqi: airQuality,
        name: weatherData.name,
        coord: { lat, lon },
        country: weatherData.sys.country, 
      };
    } catch (error) {
      console.error("Error fetching current weather data:", error);
      throw new Error("Failed to fetch current weather data");
    }
  }

  // Fetch Historical Weather Data for the Past 24 Hours
  if (type === "historical" && timestamp) {
    try {
      const hourlyData = [];

      // Loop through each hour for the past 24 hours
      for (let i = 0; i < 24; i++) {
        const hourTimestamp = timestamp - i * 3600;
        const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${hourTimestamp}&appid=${apiKey}&units=metric`;

        const historicalResponse = await fetch(url);

        if (!historicalResponse.ok) {
          const errorText = await historicalResponse.text();
          console.error("Error Response Text:", errorText);
          throw new Error("Failed to fetch historical weather data");
        }

        const historicalData = await historicalResponse.json();

        // Check if hourly data exists before mapping
        if (historicalData.data && Array.isArray(historicalData.data)) {
          const hourly = historicalData.data.map((hour: any) => {
            const date = new Date(hour.dt * 1000);
            date.setMinutes(0, 0, 0); // Round to the nearest hour
          
            return {
              time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), 
              temp: hour.temp,
              aqi: hour.uvi || 0, // TEMP FIX: No direct AQI, using UV Index as a placeholder
            };
          });
          
          hourlyData.push(...hourly);
        } else {
          console.warn("No historical AQI data available.");
        }        
      }

      return hourlyData.reverse();
    } catch (error) {
      console.error("Error fetching historical weather data:", error);
      throw new Error("Failed to fetch historical weather data");
    }
  }

  throw new Error("Invalid type or missing timestamp for historical data");
}

export async function getAirQuality(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error Response Text:", errorText);
      throw new Error("Failed to fetch air quality data");
    }

    const aqiData = await response.json();

    // Extract AQI value (1-5 scale)
    const aqiValue = aqiData.list?.[0]?.main?.aqi;

    return aqiValue ?? null; // Return AQI or null if unavailable
  } catch (error) {
    return null; // Return null if API fails
  }
}
