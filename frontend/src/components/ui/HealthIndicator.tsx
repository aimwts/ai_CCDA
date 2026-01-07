import React from "react";

export default function HealthIndicator({
  label,
  status
}: {
  label: string;
  status: "healthy" | "warning" | "error" | undefined;
}) {
  const color =
    status === "healthy"
      ? "bg-green-500"
      : status === "warning"
      ? "bg-yellow-500"
      : status === "error"
      ? "bg-red-500"
      : "bg-gray-400";

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded shadow">
      <div className={`w-4 h-4 rounded-full ${color}`} />
      <div className="text-sm font-medium">{label}</div>
    </div>
  );
}
