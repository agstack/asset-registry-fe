import "./styles.css";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import MapService from "../../Services/MapService";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { findCenter } from "../../Utils/helper";

interface IProps {
  setField: (e: any) => void;
}

const Search = (props: IProps) => {
  const map = useMap();
  const [searchText, setSearchText] = useState("");

  const onSearch = async (searchText: string) => {
    const data = await MapService.getField(searchText);
    props.setField(data);
    const centerPoint = findCenter(data);
    if (centerPoint)
      if (centerPoint instanceof L.LatLngBounds) map.fitBounds(centerPoint);
      else map.setView(centerPoint);
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
      <FaSearch className="search-icon" onClick={() => onSearch(searchText)} />
    </div>
  );
};

export default Search;
