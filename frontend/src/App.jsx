import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <NavBar />
        <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
