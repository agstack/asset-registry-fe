import "./styles.css";
import { FaSearch, FaPercent } from "react-icons/fa";
import { useState } from "react";
import MapService from "../../Services/MapService";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { findCenter } from "../../Utils/helper";
import { BsThreeDotsVertical } from "react-icons/bs";
import { OverlayTrigger, Popover } from "react-bootstrap";

interface IProps {
  setJson: (e: any) => void;
}

const Search = (props: IProps) => {
  const map = useMap();
  const [searchText, setSearchText] = useState("");

  const onSearch = async (searchText: string) => {
    const data = await MapService.getField(searchText);
    const centerPoint = findCenter(data["Geo JSON"]);
    if (centerPoint) {
      if (centerPoint instanceof L.LatLngBounds) map.fitBounds(centerPoint);
      else map.setView(centerPoint);
    }
    props.setJson(data);
  };

  return (
    <>
      <div className="search-container">
        <OverlayTrigger
          placement="right-end"
          trigger="click"
          rootClose
          overlay={
            <Popover id="search-popover">
              <Popover.Body>
                <p>Search by Geo IDs: </p>
                <div className="search">
                  <input
                    type="text"
                    className="searchTerm"
                    placeholder="ID"
                    onChange={(value) => setSearchText(value.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onSearch(searchText);
                    }}
                  />
                  <FaSearch
                    className="search-icon"
                    onClick={() => onSearch(searchText)}
                  />
                </div>
                <p className="mt-2">Get percentage of two Geo IDs: </p>
                <div className="search">
                  <input
                    type="text"
                    className="searchTerm"
                    placeholder="ID"
                    // onChange={(value) => setSearchText(value.target.value)}
                  />
                </div>

                <div className="search mt-2">
                  <input
                    type="text"
                    className="searchTerm"
                    placeholder="ID"
                    // onChange={(value) => setSearchText(value.target.value)}
                  />
                </div>
                <button
                  className="popup-btn align-self-center"
                  onClick={() => {}}
                >
                  <FaPercent className="search-icon" />
                  Percentage
                </button>
              </Popover.Body>
            </Popover>
          }
        >
          <div className="options">
            <BsThreeDotsVertical color="black" height={"40px"} width={"40px"} />
          </div>
        </OverlayTrigger>
      </div>
    </>
  );
};

export default Search;
