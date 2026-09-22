import { useEffect, useState } from "react";
import KpiCards from "../components/KpiCards";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import WellDetail from "../components/WellDetail";
import { getWells } from "../api";

export default function MapPage() {
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: "", operator: "", well_type: "active" });
  const [selectedWellId, setSelectedWellId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getWells({ limit: 500, ...filters })
      .then(setWells)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <KpiCards wells={wells} />

      <div style={{ display: "flex", flex: 1, position: "relative", minHeight: 0 }}>
        <Sidebar filters={filters} onChange={setFilters} />

        <div style={{ flex: 1, position: "relative" }}>
          {loading && <p style={{ padding: "16px" }}>Loading wells...</p>}
          {error && <p style={{ padding: "16px", color: "red" }}>{error}</p>}
          {!loading && !error && (
            <MapView wells={wells} onSelectWell={setSelectedWellId} />
          )}

          {selectedWellId && (
            <WellDetail
              wellId={selectedWellId}
              onClose={() => setSelectedWellId(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
