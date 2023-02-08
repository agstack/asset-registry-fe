import "./styles.css";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "bootstrap/dist/css/bootstrap.css";
import L from "leaflet";
import { useRef, useState } from "react";
import Search from "../Search";
import { toWKT } from "../../Utils/helper";
import MapService from "../../Services/MapService";
import ReactJson from "react-json-view";
import { Button, Overlay, Popover } from "react-bootstrap";
import Control from "react-leaflet-custom-control";
import { BsTrash2 } from "react-icons/bs";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const Map = () => {
  const [alreadyRegisterGeoJson, setAlreadyRegisterGeoJson] =
    useState<any>(null);
  const [requestedGeoJson, setRequestedGeoJson] = useState<any>(null);
  const [field, setField] = useState<any>(null);
  const [json, setJson] = useState<any>(null);
  const [center, setCenter] = useState<L.LatLngExpression>([
    31.481588, 74.322621,
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState<any>(null);
  const mapRef = useRef<any>(null);

  const fetchField = async (layer: any, type: string) => {
    const wktData = toWKT(layer);
    console.log(wktData);
    if (wktData !== "") {
      let data;
      if (type === "rectangle") {
        data = await MapService.getFieldWithRectangle(wktData);
      } else if (type === "polygon" || type === "polyline") {
        data = await MapService.getOverlappingFields(wktData);
      } else if (
        type === "marker" ||
        type === "circlemarker" ||
        type === "circle"
      ) {
        data = await MapService.getFieldWithPoint(wktData);
      }
      setJson({ data });
      setField(data["Geo JSON"]);
    } else {
      console.log("Unable to convert layer into WKT!");
    }
  };

  const registerField = async (layer: any, type: string) => {
    setAlreadyRegisterGeoJson(null);
    setRequestedGeoJson(null);
    const wktData = toWKT(layer);
    if (wktData !== "") {
      const response = await MapService.registerField(wktData);
      setJson(response);
      if (response["Geo JSON"]) {
        setAlreadyRegisterGeoJson(response["Geo JSON"]);
      } else {
        setAlreadyRegisterGeoJson(response["Geo JSON registered"]);
        setRequestedGeoJson(response["Geo JSON requested"]);
      }
    } else {
      console.log("Unable to convert layer into WKT!");
    }
  };

  const setJsonData = (data: any) => {
    setJson({ data });
    const geojson = data["Geo JSON"];
    setField(geojson);
    if (mapRef.current) {
      mapRef.current.clearLayers().addData(geojson);
    }
  };

  return (
    <>
      <div className="map">
        <MapContainer center={center} zoom={31}>
          <Search setJson={setJsonData} />
          <TileLayer
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="Map by Google"
            url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            zoomOffset={0}
            noWrap={true}
          />
          <Control prepend position="topright">
            <Button color="inherit" onClick={()=>{
              setJson(null);
              setField(null);
            }}>
              <BsTrash2 />
            </Button>
          </Control>
          {alreadyRegisterGeoJson !== null && (
            <GeoJSON
              data={alreadyRegisterGeoJson as GeoJSON.Feature}
              style={{
                weight: 1.5,
                fillColor: "#55cf6c",
                color: "#55cf6c",
                fillOpacity: 0.5,
                opacity: 0.9,
              }}
            />
          )}
          {requestedGeoJson !== null && (
            <GeoJSON
              data={requestedGeoJson as GeoJSON.Feature}
              style={{
                weight: 1.5,
                fillColor: "#ff5e6e",
                color: "#ff5e6e",
                fillOpacity: 0.5,
                opacity: 0.9,
              }}
            />
          )}
          {field !== null && (
            <GeoJSON
              ref={mapRef}
              key={field.toString()}
              data={field as GeoJSON.Feature}
              style={{
                weight: 1.5,
                fillColor: "#55cf6c",
                color: "#55cf6c",
                fillOpacity: 0.5,
                opacity: 0.9,
              }}
            />
          )}
          <FeatureGroup>
            <EditControl
              position="topright"
              draw={{
                polyline: {
                  shapeOptions: {
                    color: "#ff5e6e",
                  },
                },
                polygon: {
                  shapeOptions: {
                    color: "#ff5e6e",
                  },
                },
                circle: {
                  shapeOptions: {
                    color: "#ff5e6e",
                  },
                },
                circlemarker: {
                  shapeOptions: {
                    color: "#ff5e6e",
                  },
                },
                marker: {
                  shapeOptions: {
                    color: "#ff5e6e",
                  },
                },
                rectangle: {
                  shapeOptions: {
                    color: "#ff5e6e",
                  },
                },
              }}
              onCreated={(e) => {
                try {
                  e.layer.on("click", (layer: any) => {
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
          src={json ?? {}}
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
            {target?.layerType === "polygon" && (
              <button
                className="popup-btn"
                onClick={() => {
                  registerField(target.layer, target.layerType);
                }}
              >
                Register Field
              </button>
            )}
          </div>
        </Popover>
      </Overlay>
    </>
  );
};

export default Map;
