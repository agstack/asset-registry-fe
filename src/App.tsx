import "./App.css";
import Map from "./Component/Map";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="App">
            <Map />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
