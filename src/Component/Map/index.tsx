import "./index.css";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"

function Map() {
  return (
    <MapContainer center={[31.484197593497182, 74.33296316316658]} zoom={14}>
      <TileLayer
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
        attribution="Maps by Google"
        url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
        zoomOffset={0}
        noWrap={true}
      />
    </MapContainer>
  );
}

export default Map;
