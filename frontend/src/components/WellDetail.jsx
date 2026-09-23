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
        const byMonth = {};
        for (const p of prodData) {
          const month = p.log_date.slice(0, 7);
          const entry = byMonth[month] || { month };
          if (p.product_type === "OIL") entry.oil_bpd = p.production_bpd;
          if (p.product_type === "GAS") entry.gas_bpd = p.production_bpd;
          byMonth[month] = entry;
        }
        setProduction(Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month)));
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
            <br />
            <strong>Type:</strong>{" "}
            {well.well_type === "oil" ? "Oil" : well.well_type === "gas" ? "Gas" : "Inactive"}
          </p>

          <h4>Production history (bpd)</h4>
          {production.length === 0 && <p>No production data for this well.</p>}
          {production.length > 0 && (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={production}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(value) => Number(value).toFixed(1)} />
                <Line
                  type="monotone"
                  dataKey="oil_bpd"
                  name="Oil"
                  stroke="#1a7f37"
                  dot={false}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="gas_bpd"
                  name="Gas"
                  stroke="#d97706"
                  dot={false}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
}
