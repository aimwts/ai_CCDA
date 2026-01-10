import { useEffect, useState } from "react";
import PageContainer from "../components/Layout/PageContainer";
import HealthIndicator from "../components/ui/HealthIndicator";
import MetricCard from "../components/ui/MetricCard";
import { useWebSocket } from "../hooks/useWebSocket";

export default function SystemMonitor() {
  const wsMessage = useWebSocket("system");

  const [status, setStatus] = useState<any>({});

  useEffect(() => {
    if (wsMessage?.type === "systemStatus") {
      setStatus(wsMessage.payload);
    }
  }, [wsMessage]);

  return (
    <PageContainer title="System Monitor">
      <h2 className="text-xl font-semibold mb-4">Service Health</h2>

      <div className="flex gap-4 mb-6">
        <HealthIndicator label="Backend" status={status.backend} />
        <HealthIndicator label="Arduino" status={status.arduino} />
        <HealthIndicator label="Python Services" status={status.python} />
        <HealthIndicator label="SWIM" status={status.swim} />
      </div>

      <h2 className="text-xl font-semibold mb-4">System Metrics</h2>

      <div className="flex gap-4 mb-6">
        <MetricCard label="Uptime" value={status.uptime} />
        <MetricCard label="CPU Usage" value={`${status.cpu}%`} />
        <MetricCard label="Memory Usage" value={`${status.memory}%`} />
      </div>

      <h2 className="text-xl font-semibold mb-4">Details</h2>

      <pre className="bg-white p-4 rounded shadow text-sm">
        {JSON.stringify(status.details || {}, null, 2)}
      </pre>
    </PageContainer>
  );
}
