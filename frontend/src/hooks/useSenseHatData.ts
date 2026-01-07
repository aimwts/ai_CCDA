import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useSenseHatData(pollInterval = 1000) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await api.getSenseHatData();
        if (mounted) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("SenseHat data fetch error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, pollInterval);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [pollInterval]);

  return { data, loading };
}
