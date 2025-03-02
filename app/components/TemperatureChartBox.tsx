"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

interface GraphData {
  time: string;
  temp: number;
  city: string;
}

interface Props {
  graphData: GraphData[];
}

export default function TemperatureGraphWrapper({ graphData }: Props) {
  const cities = [...new Set(graphData.map((data) => data.city))];
  
  // Predefined colors for each city (can add more if needed)
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00c0ff"];
  const cityColorMap: Record<string, string> = {};
  cities.forEach((city, index) => {
    cityColorMap[city] = colors[index % colors.length]; // Assign colors in order
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={graphData}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.7)", color: "#fff" }} />
        <Legend wrapperStyle={{ fontSize: 14 }} />

        {cities.map((city) => (
          <Line
            key={city}
            type="monotone"
            dataKey="temp"
            data={graphData.filter((data) => data.city === city)}
            name={city}
            stroke={cityColorMap[city]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
