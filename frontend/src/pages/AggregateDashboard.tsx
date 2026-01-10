import { useEffect, useState } from "react";
import PageContainer from "../components/Layout/PageContainer";
import { useWebSocket } from "../hooks/useWebSocket";

export default function AggregateDashboard() {
  // WebSocket channels
  const plantMsg = useWebSocket("plant");
  const senseMsg = useWebSocket("sensehat");
  const systemMsg = useWebSocket("system");
  const zone1Msg = useWebSocket("zone1");
  const zone2Msg = useWebSocket("zone2");
  const zone3Msg = useWebSocket("zone3");
  const aiSummaryMsg = useWebSocket("ai_summary");
  const anomalyMsg = useWebSocket("ai_anomaly");

  // State
  const [plant, setPlant] = useState<any>({});
  const [sense, setSense] = useState<any>({});
  const [system, setSystem] = useState<any>({});
  const [aiSummary, setAiSummary] = useState<string>("");
  const [anomalies, setAnomalies] = useState([]);
  const [anomalyExplanation, setAnomalyExplanation] = useState("");

  const [zones, setZones] = useState<any>({
    zone1: {},
    zone2: {},
    zone3: {}
  });

  // Plant
  useEffect(() => {
    if (plantMsg?.type === "plant") setPlant(plantMsg.payload);
  }, [plantMsg]);

  // SenseHat
  useEffect(() => {
    if (senseMsg?.type === "sensehat") setSense(senseMsg.payload);
  }, [senseMsg]);

  // System
  useEffect(() => {
    if (systemMsg?.type === "system") setSystem(systemMsg.payload);
  }, [systemMsg]);

  // Anomaly
  useEffect(() => {
  if (anomalyMsg?.type === "ai_anomaly") {
    setAnomalies(anomalyMsg.anomalies);
    setAnomalyExplanation(anomalyMsg.explanation);
    }
  }, [anomalyMsg]);

  // Zones
  useEffect(() => {
    if (zone1Msg?.type === "zone")
      setZones((z: any) => ({ ...z, zone1: zone1Msg.payload }));
  }, [zone1Msg]);

  useEffect(() => {
    if (zone2Msg?.type === "zone")
      setZones((z: any) => ({ ...z, zone2: zone2Msg.payload }));
  }, [zone2Msg]);

  useEffect(() => {
    if (zone3Msg?.type === "zone")
      setZones((z: any) => ({ ...z, zone3: zone3Msg.payload }));
  }, [zone3Msg]);

  // AI Summary
  useEffect(() => {
    if (aiSummaryMsg?.type === "ai_summary") {
      setAiSummary(aiSummaryMsg.summary);
    }
  }, [aiSummaryMsg]);

  return (
    <PageContainer title="Aggregate Dashboard">

      {/* AI Summary Panel */}
      {aiSummary && (
        <div className="p-4 mb-6 bg-indigo-50 border border-indigo-200 rounded shadow">
          <h3 className="font-semibold text-indigo-700 mb-2">AI Summary</h3>
          <p className="text-indigo-900">{aiSummary}</p>
        </div>
      )}

{/* AI Anomaly Panel */} {anomalies.length > 0 && ( 
  <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded shadow"> 
    <h3 className="font-semibold text-red-700 mb-2">AI Anomaly Detection</h3> 
    <ul className="text-red-900 mb-2"> 
      {anomalies.map((a, i) => ( 
        <li key={i}> 
          {a.source} → {a.metric} deviated from baseline ({a.baseline.toFixed(2)}) to {a.value.toFixed(2)} 
        </li> 
      ))} 
    </ul> 
    <p className="text-red-800">{anomalyExplanation}</p> 
  </div> 
)}
      <h2 className="text-xl font-semibold mb-4">Environment Overview</h2>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Plant */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Plant Monitor</h3>
          <p>Moisture: {plant.moisture}</p>
          <p>Light: {plant.light}</p>
          <p>Temperature: {plant.temperature}</p>
        </div>

        {/* SenseHat */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">SenseHat</h3>
          <p>Temperature: {sense.temperature}</p>
          <p>Humidity: {sense.humidity}</p>
          <p>Pressure: {sense.pressure}</p>
        </div>

        {/* System */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">System</h3>
          <p>CPU: {system.cpu}%</p>
          <p>Memory: {system.memory}%</p>
          <p>Uptime: {system.uptime}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Zones Overview</h2>

      <div className="grid grid-cols-3 gap-4">
        {["zone1", "zone2", "zone3"].map((z) => (
          <div key={z} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold mb-2">{z.toUpperCase()}</h3>
            <p>Temperature: {zones[z]?.temperature?.toFixed(2)} °C</p>
            <p>Humidity: {zones[z]?.humidity?.toFixed(2)} %</p>
            <p>Status: {zones[z]?.status}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
