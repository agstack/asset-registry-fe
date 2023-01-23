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
import ReactJson from "react-json-view";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const Map = () => {
  const [field, setField] = useState<any>(null);

  const [center, setCenter] = useState<L.LatLngExpression>([
    31.481588, 74.322621,
  ]);

  const fetchField = async (layer: any, type: string) => {
    const wktData = toWKT(layer);
    if (wktData !== "") {
      let data;
      if (type === "rectangle") {
        data = await MapService.getFieldWithRectangle(wktData);
      } else if (type === "polygon" || type === "polyline") {
        data = await MapService.getFieldWithPolygon(wktData);
      } else if (
        type === "marker" ||
        type === "circlemarker" ||
        type === "circle"
      ) {
        data = await MapService.getFieldWithPoint(wktData);
      }
      setField(data);
    } else {
      console.log("Unable to convert layer into WKT!");
    }
  };

  return (
    <div className="map">
      <MapContainer center={center} zoom={31}>
        <Search setField={setField} />
        <TileLayer
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          attribution="Map by Google"
          url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
          zoomOffset={0}
          noWrap={true}
        />
        {field !== null &&
          (field.type === "FeatureCollection" ? (
            <GeoJSON data={field as GeoJSON.FeatureCollection} />
          ) : (
            <GeoJSON data={field as GeoJSON.Feature} />
          ))}
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{}}
            onCreated={(e) => {
              try {
                var link = $(
                  '<button style="background: "white"; border-radius: "4px"">Fetch Field</button>'
                ).click(function () {
                  fetchField(e.layer, e.layerType);
                })[0];
                e.layer.bindPopup(link);
              } catch (err) {
                console.log("ERROR: ", err);
              }
            }}
          ></EditControl>
        </FeatureGroup>
      </MapContainer>
      <ReactJson
        src={field ?? {}}
        quotesOnKeys={false}
        displayDataTypes={false}
        displayObjectSize={false}
        name={""}
        defaultValue={{}}
        enableClipboard={false}
        iconStyle={"square"}
        theme={"grayscale:inverted"}
      />
    </div>
  );
};

export default Map;
