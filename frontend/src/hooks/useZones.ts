import { useEffect, useState } from "react";
import { api } from "../api/client";

export function useZones() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getZones()
      .then((res) => {
        setZones(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Zones fetch error:", err));
  }, []);

  return { zones, loading };
}
