import PageContainer from "../components/Layout/PageContainer";
import HistoricalChart from "../components/ui/HistoricalChart";
import { useHistory } from "../hooks/useHistory";
import { useState } from "react";

export default function HistoryPage() {
  const [sensor, setSensor] = useState("machine");
  const [hours, setHours] = useState(24);

  const { data, loading } = useHistory(sensor, hours);

  return (
    <PageContainer title="Historical Analytics">
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={sensor}
          onChange={(e) => setSensor(e.target.value)}
        >
          <option value="machine">Machine Sensors</option>
          <option value="sensehat">SenseHat Sensors</option>
          <option value="aggregate">Aggregate</option>
        </select>

        <select
          className="border p-2 rounded"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        >
          <option value={6}>Last 6 hours</option>
          <option value={12}>Last 12 hours</option>
          <option value={24}>Last 24 hours</option>
          <option value={72}>Last 3 days</option>
          <option value={168}>Last 7 days</option>
        </select>
      </div>

      {loading ? <p>Loading…</p> : <HistoricalChart data={data} />}
    </PageContainer>
  );
}
