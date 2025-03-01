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
      console.log("Fetching Current Weather Data...");
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
      console.log("Current Weather Data:", weatherData);

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
        sunset: weatherData.sys.sunset,   // Sunset time
        aqi: 0, // Placeholder for AQI
        name: weatherData.name,
        coord: {
          lat: lat,
          lon: lon,
        },
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
      console.log("Fetching Historical Weather Data for 24 Hours...");
      const hourlyData = [];

      // Loop through each hour for the past 24 hours
      for (let i = 0; i < 24; i++) {
        const hourTimestamp = timestamp - i * 3600;
        const url = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${hourTimestamp}&appid=${apiKey}&units=metric`;

        console.log("Request URL:", url);

        const historicalResponse = await fetch(url);

        console.log("Response Status:", historicalResponse.status);

        if (!historicalResponse.ok) {
          const errorText = await historicalResponse.text();
          console.error("Error Response Text:", errorText);
          throw new Error("Failed to fetch historical weather data");
        }

        const historicalData = await historicalResponse.json();
        console.log("Historical Data:", historicalData);

        // Check if hourly data exists before mapping
        if (historicalData.hourly && Array.isArray(historicalData.hourly)) {
          const hourly = historicalData.hourly.map((hour: any) => ({
            time: new Date(hour.dt * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temp: hour.temp,
            aqi: hour.air_quality?.["us-epa-index"] || 0, // Default to 0 if no AQI data
          }));

          hourlyData.push(...hourly);
        } else {
          console.warn("No hourly data available for this timestamp.");
        }
      }

      console.log("Combined Historical Data:", hourlyData);

      return hourlyData;
    } catch (error) {
      console.error("Error fetching historical weather data:", error);
      throw new Error("Failed to fetch historical weather data");
    }
  }

  throw new Error("Invalid type or missing timestamp for historical data");
}