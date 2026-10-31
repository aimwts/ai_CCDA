import { useEffect, useState } from "react";
import { api } from "../api/clients";

export function useHistory(sensor: string, hours = 24) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    api
      .getHistory(sensor, hours)
      .then((res) => {
        if (mounted) setData(res.data);
      })
      .catch((error) => {
        console.error("History data fetch error:", error);
        if (mounted) {
          setData([]);
          setError(true);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [sensor, hours]);

  return { data, loading, error };
}
