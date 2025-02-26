// app/components/TemperatureGraphWrapper.tsx
"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart>
        <XAxis dataKey="time" tickFormatter={(time) => time.split(" ")[1]} />
        <YAxis />
        <Tooltip />
        <Legend />

        {cities.map((city) => (
          <Line
            key={city}
            type="monotone"
            dataKey="temp"
            data={graphData.filter((data) => data.city === city)}
            name={city}
            stroke="#8884d8"
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
