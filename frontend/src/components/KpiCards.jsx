export default function KpiCards({ wells }) {
  const total = wells.length;
  const active = wells.filter((w) => w.status === "Issued").length;
  const operators = new Set(wells.map((w) => w.operator)).size;

  const cards = [
    { label: "Wells shown", value: total.toLocaleString() },
    { label: "Active (Issued)", value: active.toLocaleString() },
    { label: "Unique operators", value: operators.toLocaleString() },
  ];

  return (
    <div style={{ display: "flex", gap: "12px", padding: "12px" }}>
      {cards.map((c) => (
        <div
          key={c.label}
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontSize: "12px", color: "#666" }}>{c.label}</div>
          <div style={{ fontSize: "22px", fontWeight: 600 }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
