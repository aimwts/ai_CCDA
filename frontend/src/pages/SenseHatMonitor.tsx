import { useEffect, useState } from "react";
import PageContainer from "../components/Layout/PageContainer";
import SensorCard from "../components/ui/SensorCard";
import LiveChart from "../components/ui/LiveChart";
import IMUOrientation from "../components/ui/IMUOrientation";
import JoystickIndicator from "../components/ui/JoystickIndicator";
import { useWebSocket } from "../hooks/useWebSocket";

export default function SenseHatMonitor() {
  const wsMessage = useWebSocket("sensehat");

  const [data, setData] = useState<any>({});
  const [tempHistory, setTempHistory] = useState<any[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (!wsMessage) return;

    if (wsMessage.type === "sensehat") {
      const update = wsMessage.payload;
      setData((prev) => ({ ...prev, ...update }));

      const timestamp = new Date().toLocaleTimeString();

      if (update.temperature !== undefined) {
        setTempHistory((prev) => [
          ...prev.slice(-50),
          { timestamp, value: update.temperature }
        ]);
      }

      if (update.humidity !== undefined) {
        setHumidityHistory((prev) => [
          ...prev.slice(-50),
          { timestamp, value: update.humidity }
        ]);
      }
    }

    if (wsMessage.type === "recommendations") {
      setRecommendations(wsMessage.recommendations || []);
    }
  }, [wsMessage]);

  return (
    <PageContainer title="SenseHat Monitor">
      <div className="flex gap-4 mb-6">
        <SensorCard label="Temperature" value={data.temperature} unit="°C" color="#2563eb" />
        <SensorCard label="Humidity" value={data.humidity} unit="%" color="#059669" />
        <SensorCard label="Pressure" value={data.pressure} unit="hPa" color="#f59e0b" />
      </div>

      <div className="flex gap-4 mb-6">
        <IMUOrientation pitch={data.pitch || 0} roll={data.roll || 0} yaw={data.yaw || 0} />
        <JoystickIndicator direction={data.joystick || "None"} />
      </div>

      <h3 className="text-lg font-semibold mb-2">Temperature Trend</h3>
      <LiveChart data={tempHistory} color="#2563eb" />

      <h3 className="text-lg font-semibold mt-6 mb-2">Humidity Trend</h3>
      <LiveChart data={humidityHistory} color="#059669" />

      <h3 className="text-lg font-semibold mt-8 mb-2">AI Recommendations</h3>
      <div className="flex flex-col gap-2">
        {recommendations.map((r, i) => (
          <div key={i} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
            {r}
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
