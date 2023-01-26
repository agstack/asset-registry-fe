import "./styles.css";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "bootstrap/dist/css/bootstrap.css";
import L from "leaflet";
import { useState } from "react";
import Search from "../Search";
import { toWKT } from "../../Utils/helper";
import MapService from "../../Services/MapService";
import ReactJson from "react-json-view";
import { Overlay, Popover } from "react-bootstrap";

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
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState<any>(null);

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
    <>
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
                  e.layer.on("click", (layer: any) => {
                    console.log(e);
                    setTarget(e);
                    setShowPopup(true);
                  });
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
      <Overlay
        target={target}
        show={showPopup}
        rootClose
        onHide={() => setShowPopup(false)}
      >
        <Popover id="field-popover" title="Popover bottom">
          <div className="popup-body">
            <p className="popup-heading">Field Actions</p>
            <button
              className="popup-btn"
              onClick={() => {
                fetchField(target.layer, target.layerType);
              }}
            >
              Fetch Field
            </button>
            <button className="popup-btn">Register Field</button>
          </div>
        </Popover>
      </Overlay>
    </>
  );
};

export default Map;
