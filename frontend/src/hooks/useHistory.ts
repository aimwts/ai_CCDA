import { useEffect, useState } from "react";
import axios from "axios";

export function useHistory(sensor: string, hours = 24) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(false);

    axios
      .get(`http://localhost:3000/history/${sensor}?hours=${hours}`)
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
