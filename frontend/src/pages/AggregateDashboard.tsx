import { useEffect, useState } from "react";
import PageContainer from "../components/Layout/PageContainer";
import { useWebSocket } from "../hooks/useWebSocket";

export default function AggregateDashboard() {
  // WebSocket channels
  const machineMsg = useWebSocket("machine");
  const senseMsg = useWebSocket("sensehat");
  const systemMsg = useWebSocket("system");
  const zone1Msg = useWebSocket("zone1");
  const zone2Msg = useWebSocket("zone2");
  const zone3Msg = useWebSocket("zone3");
  const aiSummaryMsg = useWebSocket("ai_summary");
  const anomalyMsg = useWebSocket("ai_anomaly");
  const trendMsg = useWebSocket("ai_trend");
  const [forecast, setForecast] = useState("");
  const feedMsg = useWebSocket("ai_recommendation_feed");
  const rootMsg = useWebSocket("ai_rootcause");

  // State
  const [machine, setMachine] = useState<any>({});
  const [sense, setSense] = useState<any>({});
  const [system, setSystem] = useState<any>({});
  const [aiSummary, setAiSummary] = useState<string>("");
  const [anomalies, setAnomalies] = useState([]);
  const [anomalyExplanation, setAnomalyExplanation] = useState("");
  const [feed, setFeed] = useState<string[]>([]);
  const [rootCause, setRootCause] = useState("");

  const [zones, setZones] = useState<any>({
    zone1: {},
    zone2: {},
    zone3: {}
  });

  const [zoneHistory, setZoneHistory] = useState<any>({
  zone1: [],
  zone2: [],
  zone3: []
  });

  const [zoneStatusFlash, setZoneStatusFlash] = useState({
  zone1: false,
  zone2: false,
  zone3: false
  });

  // Machine
  useEffect(() => {
    if (machinetMsg?.type === "machine") setMachine(machineMsg.payload);
  }, [machineMsg]);

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

  useEffect(() => {
  if (trendMsg?.type === "ai_trend") {
    setForecast(trendMsg.forecast);
    }
  }, [trendMsg]);

  useEffect(() => {
  if (feedMsg?.type === "ai_recommendation_feed") {
    setFeed(feedMsg.feed);
    }
  }, [feedMsg]);

  useEffect(() => {
  if (rootMsg?.type === "ai_rootcause") {
    setRootCause(rootMsg.analysis);
  }
  }, [rootMsg]);

  // Zones
  useEffect(() => {
  if (zone1Msg?.type === "zone") {
    const prev = zones.zone1?.status;
    const next = zone1Msg.payload.status;

    setZones((z: any) => ({ ...z, zone1: zone1Msg.payload }));

    if (prev && prev !== next) {
      setZoneStatusFlash((f: any) => ({ ...f, zone1: true }));
      setTimeout(() => {
        setZoneStatusFlash((f: any) => ({ ...f, zone1: false }));
      }, 600);
    }

    setZoneHistory((h: any) => ({
      ...h,
      zone1: [...h.zone1.slice(-20), zone1Msg.payload]
    }));
  }
}, [zone1Msg]);


  useEffect(() => {
  if (zone1Msg?.type === "zone") {
    const prev = zones.zone2?.status;
    const next = zone1Msg.payload.status;

    setZones((z: any) => ({ ...z, zone2: zone1Msg.payload }));

    if (prev && prev !== next) {
      setZoneStatusFlash((f: any) => ({ ...f, zone2: true }));
      setTimeout(() => {
        setZoneStatusFlash((f: any) => ({ ...f, zone2: false }));
      }, 600);
    }

    setZoneHistory((h: any) => ({
      ...h,
      zone1: [...h.zone1.slice(-20), zone2Msg.payload]
    }));
  }
}, [zone2Msg]);


  useEffect(() => {
  if (zone1Msg?.type === "zone") {
    const prev = zones.zone3?.status;
    const next = zone3Msg.payload.status;

    setZones((z: any) => ({ ...z, zone3: zone3Msg.payload }));

    if (prev && prev !== next) {
      setZoneStatusFlash((f: any) => ({ ...f, zone3: true }));
      setTimeout(() => {
        setZoneStatusFlash((f: any) => ({ ...f, zone3: false }));
      }, 600);
    }

    setZoneHistory((h: any) => ({
      ...h,
      zone1: [...h.zone1.slice(-20), zone3Msg.payload]
    }));
  }
}, [zone3Msg]);


  // AI Summary
  useEffect(() => {
    if (aiSummaryMsg?.type === "ai_summary") {
      setAiSummary(aiSummaryMsg.summary);
    }
  }, [aiSummaryMsg]);

function getZoneColor(status: string) {
   switch (status) {
    case "ok":
      return "bg-green-50 border-green-200"; 
    case "warning": 
      return "bg-yellow-50 border-yellow-200"; 
    case "critical":
      return "bg-red-50 border-red-200";
    default:
      return "bg-gray-50 border-gray-200"; 
    } 
  }

function Sparkline({ data, field }: { data: any[]; field: string }) {
  if (!data || data.length < 2) return null;

  const values = data.map((d) => d[field]);
  const max = Math.max(...values);
  const min = Math.min(...values);

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 30 - ((v - min) / (max - min)) * 30;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="100%" height="30">
      <polyline
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}
 
 
function getZoneBadge(status: string) {
  switch (status) {
    case "ok":
      return "bg-green-100 text-green-700 border-green-300";
    case "warning":
      return "bg-yellow-100 text-yellow-700 border-yellow-300 animate-pulse";
    case "critical":
      return "bg-red-100 text-red-700 border-red-300 animate-pulse";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
}
 
// palce here before return

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

{feed.length > 0 && (
  <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded shadow">
    <h3 className="font-semibold text-green-700 mb-2">AI Recommendations Feed</h3>
    <ul className="text-green-900 space-y-1">
      {feed.map((item, i) => (
        <li key={i}>• {item}</li>
      ))}
    </ul>
  </div>
)}

{rootCause && (
  <div className="p-4 mb-6 bg-purple-50 border border-purple-200 rounded shadow">
    <h3 className="font-semibold text-purple-700 mb-2">AI Root‑Cause Analysis</h3>
    <p className="text-purple-900 whitespace-pre-line">{rootCause}</p>
  </div>
)}

{forecast && (
  <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded shadow">
    <h3 className="font-semibold text-blue-700 mb-2">AI Trend Forecast (Next 30 Minutes)</h3>
    <p className="text-blue-900 whitespace-pre-line">{forecast}</p>
  </div>
)}

<h2 className="text-xl font-semibold mb-4">Environment Overview</h2>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Machine */}
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-semibold mb-2">Machine Monitor</h3>
          <p>Moisture: {machine.moisture}</p>
          <p>Light: {machine.light}</p>
          <p>Temperature: {machine.temperature}</p>
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
  <div
    key={z}
    className={`p-4 rounded shadow border ${getZoneColor(zones[z]?.status)}`}
  >
    <h3 className="font-semibold mb-2">{z.toUpperCase()}</h3>

    <p>Temperature: {zones[z]?.temperature?.toFixed(2)} °C</p>
    <Sparkline data={zoneHistory[z]} field="temperature" />

    <p>Humidity: {zones[z]?.humidity?.toFixed(2)} %</p>
    <Sparkline data={zoneHistory[z]} field="humidity" />

    <div
      className={`inline-block px-3 py-1 mt-2 text-sm font-medium border rounded-full ${getZoneBadge(
        zones[z]?.status
      )}`}
    >
      {zones[z]?.status?.toUpperCase()}
    </div>
  </div>
))}

      </div>
    </PageContainer>
  );
}
