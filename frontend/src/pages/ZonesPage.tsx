import { useEffect, useState } from "react";
import PageContainer from "../components/Layout/PageContainer";
import { api } from "../api/clients";

export default function ZonesPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getZones().then((res) => {
      setZones(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <PageContainer title="Zones">
      {loading ? (
        <p>Loading zones…</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {zones.map((z) => (
            <div key={z.id} className="p-4 bg-white rounded shadow">
              <h3 className="text-lg font-semibold">{z.name}</h3>
              <p className="text-gray-600">Machines: {z.machineCount}</p>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
