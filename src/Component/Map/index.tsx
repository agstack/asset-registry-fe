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
import {
  Button,
  Overlay,
  Popover,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Control from "react-leaflet-custom-control";
import { BsTrash2 } from "react-icons/bs";
import UserService from "../../Services/UserService";
import { useNavigate } from "react-router-dom";

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
  const editRef = useRef<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const nav = useNavigate();

  const fetchField = async (layer: any, type: string) => {
    const wktData = toWKT(layer);
    if (wktData !== "") {
      try {
        let data;
        if (type === "rectangle") {
          let lats: string = "";
          let lngs: string = "";
          layer._latlngs[0].forEach((latLng: any) => {
            lats = lats + latLng.lat + " ";
            lngs = lngs + latLng.lng + " ";
          });
          data = await MapService.getFieldWithRectangle(
            lats.slice(0, -1),
            lngs.slice(0, -1)
          );
          setJson({ data });
          setField(data);
        } else if (type === "polygon" || type === "polyline") {
          data = await MapService.getOverlappingFields(wktData);
          setJson({ data });
          setField(data);
        } else if (
          type === "marker" ||
          type === "circlemarker" ||
          type === "circle"
        ) {
          data = await MapService.getFieldWithPoint(
            layer._latlng.lat,
            layer._latlng.lng
          );
          setJson({ data });
          setField(data);
        } else {
          setJson(null);
          setField(null);
          setErrorMsg("Some thing Wrong, please try later!");
        }
      } catch (error: any) {
        setErrorMsg(error.message);
      }
    } else {
      setErrorMsg("Unable to send Request, please try later!");
    }
  };

  const registerField = async (layer: any, type: string) => {
    setAlreadyRegisterGeoJson(null);
    setRequestedGeoJson(null);
    const wktData = toWKT(layer);
    if (wktData !== "") {
      MapService.registerField(wktData)
        .then((response) => {
          setJson(response);
          if (response["Geo JSON"]) {
            setAlreadyRegisterGeoJson(response["Geo JSON"]);
          } else {
            setAlreadyRegisterGeoJson(response["Geo JSON registered"]);
            setRequestedGeoJson(response["Geo JSON requested"]);
          }
        })
        .catch((error) => {
          setErrorMsg(error.message);
        });
    } else {
      setErrorMsg("Unable to send Request, please try later!");
    }
  };

  const getPercentageOverlapFields = async (geo1: string, geo2: string) => {
    MapService.getPercentageOverlapFields(geo1, geo2)
      .then((response) => {
        setJson(response);
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  const setJsonData = (data: any) => {
    setJson({ data });
    const geojson = data["Geo JSON"];
    setField(geojson);
    if (mapRef.current) {
      mapRef.current.clearLayers().addData(geojson);
    }
  };

  const removeAllEditControlLayers = () => {
    var layerContainer = editRef.current;
    const layers = layerContainer._layers;
    const layer_ids = Object.keys(layers);
    layer_ids.forEach((id, i) => {
      if (i > 1) {
        const layer = layers[id];
        layerContainer.removeLayer(layer);
      }
    });
  };

  const onLogout = () => {
    UserService.logout()
      .then((response) => {
        nav("/");
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  return (
    <>
      <div className="map">
        <MapContainer center={center} zoom={31} ref={editRef}>
          <Search
            setJson={setJsonData}
            getPercentageOverlapFields={getPercentageOverlapFields}
          />
          <TileLayer
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="Map by Google"
            url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            zoomOffset={0}
            noWrap={true}
          />
          <Control prepend position="topright">
            <Button
              color="inherit"
              onClick={() => {
                setJson(null);
                setField(null);
                setAlreadyRegisterGeoJson(null);
                setRequestedGeoJson(null);
                removeAllEditControlLayers();
              }}
            >
              <BsTrash2 />
            </Button>
          </Control>
          <Control prepend position="topright">
            <Button
              color="inherit"
              onClick={() => {
                setJson(null);
                setField(null);
                setAlreadyRegisterGeoJson(null);
                setRequestedGeoJson(null);
                removeAllEditControlLayers();
                onLogout();
              }}
            >
              Logout
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
              data={
                field.type === "Feature"
                  ? (field as GeoJSON.Feature)
                  : (field as GeoJSON.FeatureCollection)
              }
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
                setJson(null);
                fetchField(target.layer, target.layerType);
              }}
            >
              Fetch Field
            </button>
            {target?.layerType === "polygon" && (
              <button
                className="popup-btn"
                onClick={() => {
                  setJson(null);
                  registerField(target.layer, target.layerType);
                }}
              >
                Register Field
              </button>
            )}
          </div>
        </Popover>
      </Overlay>
      <ToastContainer className="p-3" position="top-end">
        <Toast
          bg="danger"
          onClose={() => setErrorMsg("")}
          autohide
          show={errorMsg !== ""}
          delay={3000}
        >
          <Toast.Header>
            <strong className="mr-auto">Error</strong>
          </Toast.Header>
          <Toast.Body className="p-3">{errorMsg}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Map;
