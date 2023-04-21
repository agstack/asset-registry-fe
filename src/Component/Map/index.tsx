import "./styles.css";
import { MapContainer, TileLayer, FeatureGroup, GeoJSON } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "bootstrap/dist/css/bootstrap.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import Search from "../Search";
import { fetchTokensApiCall, toWKT } from "../../Utils/helper";
import MapService from "../../Services/MapService";
import ReactJson from "react-json-view";
import {
  Button,
  Form,
  Overlay,
  Popover,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Control from "react-leaflet-custom-control";
import { BsTrash2 } from "react-icons/bs";
import UserService from "../../Services/UserService";
import { useNavigate } from "react-router-dom";
import LocationMarker from "./Component/CurrentLocation";
import SearchField from "./Component/SearchLocation";
import Cookies from "js-cookie";
import { KEYS } from "../../Constants";

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const Map = () => {
  const navigate = useNavigate();
  const [alreadyRegisterGeoJson, setAlreadyRegisterGeoJson] =
    useState<any>(null);
  const [requestedGeoJson, setRequestedGeoJson] = useState<any>(null);
  const [field, setField] = useState<any>(null);
  const [json, setJson] = useState<any>(null);
  const [domains, setDomains] = useState<any>(null);
  const [center, setCenter] = useState<L.LatLngExpression>([0, 0]);
  const [showPopup, setShowPopup] = useState(false);
  const [target, setTarget] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const editRef = useRef<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [resolutionLevel, setResolutionLevel] = useState(13);
  const [threshold, setThreshold] = useState(90);
  const [domain, setDomain] = useState("");
  const [s2Index, setS2Index] = useState("8,13");
  const [isLoading, setIsLoading] = useState(false);

  const checkLoggedInStatus = async () => {
    let status = await fetchTokensApiCall();
    setIsLoggedIn(status);
  };

  useEffect(() => {
    fetchDomains();
    checkLoggedInStatus();
  }, []);

  const fetchField = async (layer: any, type: string) => {
    setIsLoading(true);
    await checkLoggedInStatus();
    const wktData = toWKT(layer);
    if (wktData !== "") {
      try {
        let respones;
        if (type === "rectangle") {
          let lats: string = "";
          let lngs: string = "";
          layer._latlngs[0].forEach((latLng: any) => {
            lats = lats + latLng.lat + " ";
            lngs = lngs + latLng.lng + " ";
          });
          respones = await MapService.getFieldWithRectangle(
            lats.slice(0, -1),
            lngs.slice(0, -1)
          );
          setJson(respones.json);
          setField(respones.data);
        } else if (type === "polygon" || type === "polyline") {
          respones = await MapService.getOverlappingFields(
            wktData,
            resolutionLevel,
            threshold,
            domain,
            s2Index
          );
          setJson(respones.json);
          setField(respones.data);
        } else if (
          type === "marker" ||
          type === "circlemarker" ||
          type === "circle"
        ) {
          respones = await MapService.getFieldWithPoint(
            layer._latlng.lat,
            layer._latlng.lng,
            s2Index,
            domain
          );
          setJson(respones.json);
          setField(respones.data);
        } else {
          setJson(null);
          setField(null);
          setErrorMsg("Something Wrong, please try later!");
        }
      } catch (error: any) {
        setIsLoading(false);
        setErrorMsg(error.message);
      }
    } else {
      setErrorMsg("Unable to send Request, please try later!");
    }
    setIsLoading(false);
  };

  const fetchDomains = async () => {
    setIsLoading(true);
    await checkLoggedInStatus();
    let response;
    try {
      response = await MapService.getDomains();
      setDomains(response["Domains"]);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMsg(error.message);
    }
    setIsLoading(false);
  };

  const registerField = async (layer: any, type: string) => {
    setIsLoading(true);
    await checkLoggedInStatus();
    setAlreadyRegisterGeoJson(null);
    setRequestedGeoJson(null);
    const wktData = toWKT(layer);
    if (wktData !== "") {
      MapService.registerField(wktData, resolutionLevel, threshold, s2Index)
        .then((response) => {
          setIsLoading(false);
          setJson(response);
          if (response["Geo JSON"]) {
            setAlreadyRegisterGeoJson(response["Geo JSON"]);
          } else {
            setAlreadyRegisterGeoJson(response["Geo JSON registered"]);
            setRequestedGeoJson(response["Geo JSON requested"]);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          setErrorMsg(error.message);
        });
    } else {
      setIsLoading(false);
      setErrorMsg("Unable to send Request, please try later!");
    }
  };

  const getPercentageOverlapFields = async (geo1: string, geo2: string) => {
    setIsLoading(true);
    await checkLoggedInStatus();
    MapService.getPercentageOverlapFields(geo1, geo2)
      .then((response) => {
        setIsLoading(false);
        setJson(response);
      })
      .catch((error) => {
        setIsLoading(false);
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
    window.open(
      `${process.env.REACT_APP_USER_REGISTRY_BASE_URL}/home`,
      "_blank"
    );
  };

  const onDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    if (editRef.current) {
      editRef.current.setView(center);
    }
  }, [center]);

  const onClickLogin = () => {
    window.open(process.env.REACT_APP_USER_REGISTRY_BASE_URL, "_blank");
  };

  return (
    <>
      {isLoading && (
        <div className="spinner">
          <div className="spinner-border"></div>
        </div>
      )}
      <div className="map">
        <MapContainer center={center} zoom={31} ref={editRef}>
          <Search
            setJson={setJsonData}
            onSearchCall={checkLoggedInStatus}
            getPercentageOverlapFields={getPercentageOverlapFields}
          />
          <SearchField />
          <TileLayer
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="Map by Google"
            url="http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
            zoomOffset={0}
            noWrap={true}
          />
          <LocationMarker setIsLoading={setIsLoading} setCenter={setCenter} />
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
            {!isLoggedIn ? (
              <Button onClick={onClickLogin} color="inherit">
                Login
              </Button>
            ) : (
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
            )}
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
                onDashboard();
              }}
            >
              Dashboard
            </Button>
          </Control>
          {alreadyRegisterGeoJson !== null && (
            <GeoJSON
              data={alreadyRegisterGeoJson as GeoJSON.Feature}
              style={{
                weight: 1.5,
                fillColor: "#ffff00",
                color: "#ffff00",
                fillOpacity: 0,
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
                fillColor: "#ffff00",
                color: "#ffff00",
                fillOpacity: 0.0,
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
                    setDomain("");
                    setResolutionLevel(13);
                    setThreshold(90);
                    setS2Index("8,13");
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
            {target && (
              <>
                {["polygon", "polyline"].includes(target.layerType) && (
                  <>
                    <p className="mt-2">Resolution level (optional): </p>
                    <div className="threshold">
                      <input
                        type="number"
                        className="thresholdTerm"
                        placeholder="level"
                        onChange={(value) =>
                          setResolutionLevel(Number(value.target.value))
                        }
                      />
                    </div>
                  </>
                )}
                {["polygon", "polyline"].includes(target.layerType ?? "") && (
                  <>
                    <p className="mt-2">threshold (optional): </p>
                    <div className="threshold mt-2">
                      <input
                        type="number"
                        className="thresholdTerm"
                        placeholder="threshold"
                        onChange={(value) =>
                          setThreshold(Number(value.target.value))
                        }
                      />
                    </div>
                  </>
                )}
                {[
                  "polygon",
                  "polyline",
                  "marker",
                  "circlemarker",
                  "circle",
                ].includes(target.layerType ?? "") && (
                  <>
                    <p className="mt-2">Domain (optional): </p>
                    <div className="threshold mt-2">
                      <Form.Select
                        className="customFormSelect"
                        aria-label="Default select example"
                        value={domain ?? "Domain"}
                        onChange={(value) => setDomain(value.target.value)}
                      >
                        <option> Domain</option>
                        {domains &&
                          domains.map((domain: any, i: any) => {
                            return (
                              <option key={i} value={domain}>
                                {domain}
                              </option>
                            );
                          })}
                      </Form.Select>
                      {/* <input
                        type="text"
                        className="thresholdTerm"
                        placeholder="Domain"
                        onChange={(value) => setDomain(value.target.value)}
                      /> */}
                    </div>
                  </>
                )}
                {[
                  "polygon",
                  "polyline",
                  "marker",
                  "circlemarker",
                  "circle",
                ].includes(target.layerType ?? "") && (
                  <>
                    <p className="mt-2">S2_index (optional): </p>
                    <div className="threshold mt-2">
                      <input
                        type="text"
                        className="thresholdTerm"
                        placeholder="S2_index"
                        onChange={(value) => setS2Index(value.target.value)}
                      />
                    </div>
                  </>
                )}
              </>
            )}
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
