import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useAggregateData(pollInterval = 2000) {
  const [sensors, setSensors] = useState<any>({});
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [sensorsRes, statusRes] = await Promise.all([
          api.getAggregateSensors(),
          api.getAggregateStatus()
        ]);

        if (mounted) {
          setSensors(sensorsRes.data);
          setStatus(statusRes.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Aggregate data fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, pollInterval);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pollInterval]);

  return { sensors, status, loading };
}
