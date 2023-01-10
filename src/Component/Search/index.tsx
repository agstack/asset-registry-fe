import "./index.css";
import "leaflet/dist/leaflet.css";
import { FaSearch } from 'react-icons/fa';

function Search() {
  return (
    <div className="search">
      <FaSearch/>
      <input
        type="text"
        className="searchTerm"
        placeholder="Search"
      />
    </div>
  );
}

export default Search;
