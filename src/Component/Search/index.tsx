import "./styles.css";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import MapService from "../../Services/MapService";
import { useMap } from "react-leaflet";
import L, { latLng, LatLng, LatLngExpression } from "leaflet";

interface IProps {
  setField: (e: any) => void;
}

const Search = (props: IProps) => {
  const map = useMap();
  const [searchText, setSearchText] = useState("");

  const onSearch = async (searchText: string) => {
    const data = await MapService.getField(searchText);
    props.setField(data);
    if (data.geometry.type === "Point") {
      const d = map.setView([
        !Array.isArray(data.geometry.coordinates[1])
          ? data.geometry.coordinates[1]
          : 0,
        !Array.isArray(data.geometry.coordinates[0])
          ? data.geometry.coordinates[0]
          : 0,
      ]);
      
    } else if (
      data.geometry.type === "LineString" &&
      Array.isArray(data.geometry.coordinates)
    ) {
      if (Array.isArray(data.geometry.coordinates)) {
        var coordinates = data.geometry.coordinates.map((rawPoint) => {
          return new L.LatLng(
            Array.isArray(rawPoint)
              ? !Array.isArray(rawPoint[1])
                ? rawPoint[1]
                : 0
              : 0,
            Array.isArray(rawPoint)
              ? !Array.isArray(rawPoint[0])
                ? rawPoint[0]
                : 0
              : 0
          );
        });
        let polyline = L.polyline(coordinates);
        polyline.addTo(map);
        map.fitBounds(polyline.getBounds());
      }
    } else {
      if (Array.isArray(data.geometry.coordinates[0])) {
        var coordinates = data.geometry.coordinates[0].map((rawPoint) => {
          return new L.LatLng(
            Array.isArray(rawPoint)
              ? !Array.isArray(rawPoint[1])
                ? rawPoint[1]
                : 0
              : 0,
            Array.isArray(rawPoint)
              ? !Array.isArray(rawPoint[0])
                ? rawPoint[0]
                : 0
              : 0
          );
        });

        let polygon = L.polygon(coordinates);
        polygon.addTo(map);
        map.fitBounds(polygon.getBounds());
      }
    }
  };

  return (
    <div className="search">
      <input
        type="text"
        className="searchTerm"
        placeholder="Search"
        onChange={(value) => setSearchText(value.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch(searchText);
        }}
      />
      <FaSearch onClick={() => onSearch(searchText)} />
    </div>
  );
};

export default Search;
