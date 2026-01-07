import { useEffect, useState } from "react";
import axios from "axios";

export function useHistory(sensor: string, hours = 24) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/history/${sensor}?hours=${hours}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  }, [sensor, hours]);

  return { data, loading };
}
