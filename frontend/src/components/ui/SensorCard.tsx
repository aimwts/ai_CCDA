export default function SensorCard({
  label,
  value,
  unit,
  color
}: {
  label: string;
  value: number | string | undefined;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="p-4 bg-white rounded shadow w-48">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold" style={{ color }}>
        {value ?? "--"} {unit}
      </div>
    </div>
  );
}
