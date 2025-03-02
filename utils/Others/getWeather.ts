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
      console.log("Current Weather Data:", JSON.stringify(weatherData, null, 2));

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
        console.log("Historical Data:", JSON.stringify(historicalData, null, 2));

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

      console.log("Combined Historical Data:", JSON.stringify(hourlyData, null, 2));

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
    console.log("Fetching Air Quality Data...");
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!response.ok) {
      console.error("Response Status:", response.status);
      const errorText = await response.text();
      console.error("Error Response Text:", errorText);
      throw new Error("Failed to fetch air quality data");
    }

    const aqiData = await response.json();
    console.log("Air Quality Data:", JSON.stringify(aqiData, null, 2));

    // Extract AQI value (1-5 scale) and log it
    const aqiValue = aqiData.list?.[0]?.main?.aqi;
    console.log(`Extracted AQI Value: ${aqiValue}`);

    return aqiValue ?? null; // Return AQI or null if unavailable
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return null; // Return null if API fails
  }
}
