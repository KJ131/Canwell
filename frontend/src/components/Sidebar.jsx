const STATUS_OPTIONS = [
  "",
  "Issued",
  "RecCertified",
  "Abandoned",
  "Suspension",
  "Cancelled",
];

export default function Sidebar({ filters, onChange }) {
  return (
    <div
      style={{
        width: "220px",
        padding: "16px",
        background: "#f7f7f7",
        borderRight: "1px solid #ddd",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Filters</h3>

      <label style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>
        Status
      </label>
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        style={{ width: "100%", padding: "6px", marginBottom: "16px" }}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s === "" ? "All statuses" : s}
          </option>
        ))}
      </select>

      <label style={{ display: "block", marginBottom: "6px", fontSize: "13px" }}>
        Operator contains
      </label>
      <input
        type="text"
        value={filters.operator}
        onChange={(e) => onChange({ ...filters, operator: e.target.value })}
        placeholder="e.g. Canadian Natural"
        style={{ width: "100%", padding: "6px", boxSizing: "border-box" }}
      />
    </div>
  );
}
