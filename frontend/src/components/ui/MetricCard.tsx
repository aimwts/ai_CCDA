export default function MetricCard({
  label,
  value
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div className="p-4 bg-white rounded shadow w-48">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value ?? "--"}</div>
    </div>
  );
}
