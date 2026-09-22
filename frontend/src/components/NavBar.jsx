import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        borderBottom: "1px solid #e2e2e2",
        background: "#fff",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "#111" }}>
        <strong style={{ fontSize: "18px" }}>CanWell</strong>
      </Link>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/dashboard" style={{ textDecoration: "none", color: "#111" }}>
          Dashboard
        </Link>
        <Link to="/map" style={{ textDecoration: "none", color: "#111" }}>
          Map
        </Link>
      </nav>
    </header>
  );
}
