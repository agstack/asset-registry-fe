import "./index.css";
import { MapContainer, TileLayer, FeatureGroup, Polyline } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";
import { useState } from "react";
import Search from "../Search";
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

function Map() {
  const [data, setData] = useState("");

  return (
    <>
      <MapContainer center={[31.48188994630442, 74.32326339907378]} zoom={25}>
        <Search />
        <TileLayer
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          attribution="Map by Google"
          url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          zoomOffset={0}
          noWrap={true}
        />
        <Polyline
          positions={[
            {
              lat: 31.481640733916475,
              lng: 74.32229879967055,
            },
            {
              lat: 31.481871380707073,
              lng: 74.32254907544122,
            },
            {
              lat: 31.481452335849873,
              lng: 74.32304796926475,
            },
            {
              lat: 31.481225555862956,
              lng: 74.32276785522846,
            },
            {
              lat: 31.481640733916475,
              lng: 74.32229879967055,
            },
          ]}
        ></Polyline>
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{}}
            onCreated={(e) => {
              console.log(e);
              setData(`${e.layerType} - ${e.layer._latlngs.toString()}`);
            }}
          ></EditControl>
        </FeatureGroup>
      </MapContainer>
      <p>{data}</p>
    </>
  );
}

export default Map;
