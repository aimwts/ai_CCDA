import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

export default function MiniChart({
  data,
  color = "#2563eb"
}: {
  data: any[];
  color?: string;
}) {
  return (
    <div className="bg-white p-4 rounded shadow w-64 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
