import "./styles.css";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";
import { useState } from "react";
import Search from "../Search";
import $ from "jquery";
import { toWKT } from "../../Utils/helper";
import MapService from "../../Services/MapService";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const Map = () => {
  const [data, setData] = useState("");
  const [field, setField] = useState<any>(null);

  const [center, setCenter] = useState<L.LatLngExpression>([
    31.481588, 74.322621,
  ]);

  const fetchField = async (layer: any) => {
    const data = await MapService.getFieldWithPoint();
    setField(data);
  };

  const convertToWKT = (layer: any) => {
    const data = toWKT(layer);
    setData("WKT:   " + data || "");
  };

  return (
    <>
      <MapContainer center={center} zoom={31}>
        <Search setField={setField} />
        <TileLayer
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          attribution="Map by Google"
          url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          zoomOffset={0}
          noWrap={true}
        />
        {field !== null && (
          <GeoJSON data={field as GeoJSON.FeatureCollection} />
        )}
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{}}
            onCreated={(e) => {
              try {
                setData(
                  `${e.layerType} 
                - ${e.layer._latlngs ?? e.layer._latlng} ~~~~~~~~ GeoJSON: 
                 ${JSON.stringify(e.layer.toGeoJSON(), null, 2)}
                `
                );
                convertToWKT(e.layer);
                var link = $(
                  '<button style="background: "white"; border-radius: "4px"">Fetch Field</button>'
                ).click(function () {
                  fetchField(e.layer);
                })[0];
                e.layer.bindPopup(link);
              } catch (err) {
                console.log("ERROR: ", err);
              }
            }}
          ></EditControl>
        </FeatureGroup>
      </MapContainer>
      <p>{data}</p>
    </>
  );
};

export default Map;
