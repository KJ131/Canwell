import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ALBERTA_CENTER = [54.5, -114.5];

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
        <Marker
          key={well.id}
          position={[well.latitude, well.longitude]}
          eventHandlers={{ click: () => onSelectWell(well.id) }}
        >
          <Popup>
            <strong>{well.name}</strong>
            <br />
            {well.operator}
            <br />
            Status: {well.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
