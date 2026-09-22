import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getWell, getWellProduction } from "../api";

export default function WellDetail({ wellId, onClose }) {
  const [well, setWell] = useState(null);
  const [production, setProduction] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getWell(wellId), getWellProduction(wellId)])
      .then(([wellData, prodData]) => {
        setWell(wellData);
        setProduction(
          prodData.map((p) => ({
            month: p.log_date.slice(0, 7),
            production_bpd: p.production_bpd,
          }))
        );
      })
      .finally(() => setLoading(false));
  }, [wellId]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "380px",
        height: "100%",
        background: "#fff",
        boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
        padding: "16px",
        overflowY: "auto",
        boxSizing: "border-box",
        zIndex: 1000,
      }}
    >
      <button onClick={onClose} style={{ float: "right" }}>
        close
      </button>

      {loading && <p>Loading...</p>}

      {!loading && well && (
        <>
          <h3>{well.name}</h3>
          <p>
            <strong>Operator:</strong> {well.operator}
            <br />
            <strong>Status:</strong> {well.status}
            <br />
            <strong>Province:</strong> {well.province}
            <br />
            <strong>Licence #:</strong> {well.well_licence_number}
          </p>

          <h4>Production history (bpd)</h4>
          {production.length === 0 && <p>No production data for this well.</p>}
          {production.length > 0 && (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={production}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="production_bpd"
                  stroke="#2b6cb0"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
}
