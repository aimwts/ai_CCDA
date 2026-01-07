import { useEffect, useState } from "react";
import { api } from "../api/client";

export function usePlantData(pollInterval = 1000) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await api.getPlantData();
        if (mounted) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Plant data fetch error:", err);
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
