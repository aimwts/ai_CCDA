export default function JoystickIndicator({ direction }: { direction: string }) {
  return (
    <div className="p-4 bg-white rounded shadow w-48">
      <h3 className="font-semibold mb-2">Joystick</h3>
      <div className="text-lg font-bold text-blue-600">{direction}</div>
    </div>
  );
}
