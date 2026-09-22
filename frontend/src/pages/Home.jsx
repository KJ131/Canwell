import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStatsSummary } from "../api";

const FEATURES = [
  {
    title: "Production Data",
    desc: "3 years of real monthly oil & gas production across Alberta wells",
    to: "/dashboard",
  },
  {
    title: "Interactive Map",
    desc: "Explore well locations, operators, and status live",
    to: "/map",
  },
  {
    title: "Well-Level Charts",
    desc: "Click any well to see its production history",
    to: "/map",
  },
];

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStatsSummary().then(setStats).catch(() => {});
  }, []);

  const statCards = stats
    ? [
        { value: stats.total_wells.toLocaleString(), label: "Total wells tracked" },
        { value: stats.oil_wells.toLocaleString(), label: "Currently producing oil" },
        { value: stats.gas_wells.toLocaleString(), label: "Currently producing gas" },
        { value: stats.operators.toLocaleString(), label: "Distinct operators" },
      ]
    : [];

  return (
    <div style={{ padding: "60px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: "42px", marginBottom: "8px" }}>
        CanWell — Alberta Oil Well Tracker
      </h1>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "32px" }}>
        Real production data from AER and Petrinex — mapped, charted, and searchable.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "56px" }}>
        <Link
          to="/dashboard"
          style={{
            background: "#111",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          View Dashboard
        </Link>
        <Link
          to="/map"
          style={{
            background: "#fff",
            color: "#111",
            border: "1px solid #ccc",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Explore Map
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          maxWidth: "900px",
          margin: "0 auto 48px",
        }}
      >
        {FEATURES.map((f) => (
          <Link
            to={f.to}
            key={f.title}
            style={{
              border: "1px solid #e2e2e2",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "left",
              textDecoration: "none",
              color: "inherit",
              display: "block",
              cursor: "pointer",
              transition: "box-shadow 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div style={{ fontWeight: 600, marginBottom: "4px" }}>{f.title}</div>
            <div style={{ color: "#666", fontSize: "14px" }}>{f.desc}</div>
          </Link>
        ))}
      </div>

      {stats && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "48px",
            background: "#f7f7f7",
            padding: "28px",
            borderRadius: "10px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {statCards.map((c) => (
            <div key={c.label}>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>{c.value}</div>
              <div style={{ fontSize: "13px", color: "#666" }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
