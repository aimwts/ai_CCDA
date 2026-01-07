export default function IMUOrientation({
  pitch,
  roll,
  yaw
}: {
  pitch: number;
  roll: number;
  yaw: number;
}) {
  return (
    <div className="p-4 bg-white rounded shadow w-64">
      <h3 className="font-semibold mb-2">IMU Orientation</h3>
      <div className="text-sm text-gray-700">
        <div>Pitch: {pitch.toFixed(2)}</div>
        <div>Roll: {roll.toFixed(2)}</div>
        <div>Yaw: {yaw.toFixed(2)}</div>
      </div>
    </div>
  );
}
