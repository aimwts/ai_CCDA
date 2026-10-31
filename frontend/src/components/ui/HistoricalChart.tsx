import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function HistoricalChart({
  data,
  color = "#2563eb"
}: {
  data: any[];
  color?: string;
}) {
  const palette = [color, "#7c3aed", "#059669", "#ea580c", "#0891b2", "#db2777"];
  const series = Array.from(
    new Set(data.map((row) => `${row.sensor || "sensor"}.${row.metric || "value"}`))
  );
  const pointsByTimestamp = new Map<string, Record<string, string | number>>();

  data.forEach((row) => {
    const timestamp = new Date(row.timestamp).toLocaleString();
    const point = pointsByTimestamp.get(timestamp) || { timestamp };
    point[`${row.sensor || "sensor"}.${row.metric || "value"}`] = row.value;
    pointsByTimestamp.set(timestamp, point);
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={Array.from(pointsByTimestamp.values())}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          {series.map((metric, index) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              name={metric}
              stroke={palette[index % palette.length]}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
