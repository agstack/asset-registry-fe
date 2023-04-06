import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const SearchField = () => {
  const provider = new OpenStreetMapProvider();
  // @ts-ignore
  const searchControl = new GeoSearchControl({
    style: "button",
    provider: provider,
    showMarker: false,
  });

  const map = useMap();
  useEffect(() => {
    map.addControl(searchControl);
  }, []);

  return null;
};

export default SearchField;
