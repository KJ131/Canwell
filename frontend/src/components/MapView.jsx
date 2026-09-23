import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

const ALBERTA_CENTER = [54.5, -114.5];

const COLORS = {
  oil: "#1a7f37",
  gas: "#d97706",
  inactive: "#9ca3af",
};

export default function MapView({ wells, onSelectWell }) {
  return (
    <MapContainer
      center={ALBERTA_CENTER}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {wells.map((well) => (
        <CircleMarker
          key={well.id}
          center={[well.latitude, well.longitude]}
          radius={6}
          pathOptions={{
            color: COLORS[well.well_type] || COLORS.inactive,
            fillColor: COLORS[well.well_type] || COLORS.inactive,
            fillOpacity: 0.8,
          }}
          eventHandlers={{ click: () => onSelectWell(well.id) }}
        >
          <Popup>
            <strong>{well.name}</strong>
            <br />
            {well.operator}
            <br />
            Type: {well.well_type}
            <br />
            Status: {well.status}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
