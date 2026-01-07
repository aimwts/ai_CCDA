import { useEffect, useState } from "react";
import PageContainer from "../components/Layout/PageContainer";
import SensorCard from "../components/SensorCard";
import LiveChart from "../components/LiveChart";
import { useWebSocket } from "../hooks/useWebSocket";

export default function PlantMonitor() {
  const wsMessage = useWebSocket("plant");

  const [data, setData] = useState<any>({});
  const [moistureHistory, setMoistureHistory] = useState<any[]>([]);
  const [lightHistory, setLightHistory] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    if (!wsMessage) return;

    if (wsMessage.type === "plant") {
      const update = wsMessage.payload;
      setData((prev) => ({ ...prev, ...update }));

      const timestamp = new Date().toLocaleTimeString();

      if (update.moisture !== undefined) {
        setMoistureHistory((prev) => [
          ...prev.slice(-50),
          { timestamp, value: update.moisture }
        ]);
      }

      if (update.light !== undefined) {
        setLightHistory((prev) => [
          ...prev.slice(-50),
          { timestamp, value: update.light }
        ]);
      }
    }

    if (wsMessage.type === "recommendations") {
      setRecommendations(wsMessage.recommendations || []);
    }
  }, [wsMessage]);

  return (
    <PageContainer title="Plant Monitor">
      <div className="flex gap-4 mb-6">
        <SensorCard label="Moisture" value={data.moisture} unit="%" color="#059669" />
        <SensorCard label="Light" value={data.light} unit="lx" color="#7c3aed" />
        <SensorCard label="Temperature" value={data.temperature} unit="°C" color="#2563eb" />
      </div>

      <h3 className="text-lg font-semibold mb-2">Moisture Trend</h3>
      <LiveChart data={moistureHistory} color="#059669" />

      <h3 className="text-lg font-semibold mt-6 mb-2">Light Trend</h3>
      <LiveChart data={lightHistory} color="#7c3aed" />

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
