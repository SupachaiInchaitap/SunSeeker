export async function getAirQualityData(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  
  try {
    console.log("Fetching 24-Hour Historical Air Quality Data...");

    const now = Math.floor(Date.now() / 1000); // Current timestamp
    const oneDayAgo = now - 86400; // 24 hours ago

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${oneDayAgo}&end=${now}&appid=${apiKey}`
    );

    if (!response.ok) {
      console.error("Response Status:", response.status);
      const errorText = await response.text();
      console.error("Error Response Text:", errorText);
      throw new Error("Failed to fetch historical air quality data");
    }

    const airQualityData = await response.json();
    console.log("Air Quality History Data:", JSON.stringify(airQualityData, null, 2));

    // Extract hourly AQI data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hourlyAQI = airQualityData.list.map((entry: any) => ({
      time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      aqi: entry.main.aqi, // AQI value (1-5 scale)
      pm2_5: entry.components.pm2_5, // Fine particulate matter
      pm10: entry.components.pm10, // Coarse particulate matter
    }));

    return hourlyAQI.reverse(); // Reverse to show oldest data first
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    return null; // Return null if API fails
  }
}
