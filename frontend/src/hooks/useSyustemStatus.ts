import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useSystemStatus(pollInterval = 2000) {
  const [status, setStatus] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await api.getSystemStatus();
        if (mounted) {
          setStatus(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("System status fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, pollInterval);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pollInterval]);

  return { status, loading };
}
