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
import { getStatsSummary, getProductionTrend } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStatsSummary(), getProductionTrend()])
      .then(([s, t]) => {
        setStats(s);
        setTrend(t);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: "24px" }}>Loading dashboard...</p>;

  const cards = stats
    ? [
        { label: "Total Wells", value: stats.total_wells.toLocaleString() },
        { label: "Oil Wells", value: stats.oil_wells.toLocaleString() },
        { label: "Gas Wells", value: stats.gas_wells.toLocaleString() },
        { label: "Inactive Wells", value: stats.inactive_wells.toLocaleString() },
        { label: "Operators", value: stats.operators.toLocaleString() },
      ]
    : [];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Dashboard</h2>

      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              flex: 1,
              background: "#fff",
              border: "1px solid #e2e2e2",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#666" }}>{c.label}</div>
            <div style={{ fontSize: "24px", fontWeight: 700 }}>{c.value}</div>
          </div>
        ))}
      </div>

      <h3>Total Alberta Production (bpd), all wells combined</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={trend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(value) => Math.round(value).toLocaleString()} />
          <Line type="monotone" dataKey="oil_bpd" name="Oil" stroke="#1a7f37" dot={false} />
          <Line type="monotone" dataKey="gas_bpd" name="Gas" stroke="#d97706" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
