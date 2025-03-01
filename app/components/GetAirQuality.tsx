// app/lib/getAirQuality.ts
export async function getAirQualityData(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  try {
    const airQualityResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    );

    if (!airQualityResponse.ok) {
      throw new Error("Failed to fetch air quality data");
    }

    const airQualityData = await airQualityResponse.json();

    // Format Data for Graph
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const graphData = airQualityData.list.map((item: any) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      aqi: item.main.aqi, // Air Quality Index (1-5 scale)
    }));

    return graphData;
  } catch (error) {
    console.error("Error fetching air quality data:", error);
    throw new Error("Failed to fetch air quality data");
  }
}
