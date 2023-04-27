import "./App.css";
import Map from "./Component/Map";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Component/Dashboard/index";

function App() {
  useEffect(() => {
    document.title = 'AgStack - Asset Registry';}, [])
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
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
