const STATUS_OPTIONS = [
  "",
  "Issued",
  "RecCertified",
  "Abandoned",
  "Suspension",
  "Cancelled",
];

const WELL_TYPE_OPTIONS = [
  { value: "active", label: "Active wells (oil & gas)" },
  { value: "oil", label: "Oil wells" },
  { value: "gas", label: "Gas wells" },
  { value: "inactive", label: "Inactive wells" },
  { value: "all", label: "All wells" },
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
        Well type
      </label>
      <select
        value={filters.well_type}
        onChange={(e) => onChange({ ...filters, well_type: e.target.value })}
        style={{ width: "100%", padding: "6px", marginBottom: "16px" }}
      >
        {WELL_TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

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

      <div style={{ marginTop: "24px", fontSize: "12px", color: "#555" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1a7f37", display: "inline-block" }} />
          Oil well
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#d97706", display: "inline-block" }} />
          Gas well
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#9ca3af", display: "inline-block" }} />
          Inactive
        </div>
      </div>
    </div>
  );
}
