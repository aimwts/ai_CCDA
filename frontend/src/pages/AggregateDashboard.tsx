import { useEffect, useState } from "react";
import PageContainer from "../components/Layout/PageContainer";
import SensorCard from "../components/ui/SensorCard";
import StatusCard from "../components/ui/StatusCard";
import MiniChart from "../components/ui/MiniChart";
import { useWebSocket } from "../hooks/useWebSocket";

export default function AggregateDashboard() {
  const wsMessage = useWebSocket("aggregate");

  const [sensors, setSensors] = useState<any>({});
  const [moistureHistory, setMoistureHistory] = useState<any[]>([]);
  const [tempHistory, setTempHistory] = useState<any[]>([]);
  const [humidityHistory, setHumidityHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!wsMessage) return;

    if (wsMessage.type === "aggregate") {
      const update = wsMessage.payload;
      setSensors((prev) => ({ ...prev, ...update }));

      const timestamp = new Date().toLocaleTimeString();

      if (update.moisture !== undefined) {
        setMoistureHistory((prev) => [
          ...prev.slice(-40),
          { timestamp, value: update.moisture }
        ]);
      }

      if (update.temperature !== undefined) {
        setTempHistory((prev) => [
          ...prev.slice(-40),
          { timestamp, value: update.temperature }
        ]);
      }

      if (update.humidity !== undefined) {
        setHumidityHistory((prev) => [
          ...prev.slice(-40),
          { timestamp, value: update.humidity }
        ]);
      }
    }
  }, [wsMessage]);

  return (
    <PageContainer title="Aggregate Dashboard">
      <h2 className="text-xl font-semibold mb-4">Latest Sensor Values</h2>

      <div className="flex gap-4 mb-6">
        <SensorCard label="Moisture" value={sensors.moisture} unit="%" color="#059669" />
        <SensorCard label="Temperature" value={sensors.temperature} unit="°C" color="#2563eb" />
        <SensorCard label="Humidity" value={sensors.humidity} unit="%" color="#f59e0b" />
        <SensorCard label="Light" value={sensors.light} unit="lx" color="#7c3aed" />
      </div>

      <h2 className="text-xl font-semibold mb-4">Trends</h2>

      <div className="flex gap-4">
        <MiniChart data={moistureHistory} color="#059669" />
        <MiniChart data={tempHistory} color="#2563eb" />
        <MiniChart data={humidityHistory} color="#f59e0b" />
      </div>
    </PageContainer>
  );
}
