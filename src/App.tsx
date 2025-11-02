import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PeriodicElements from "./PeriodicElements";
import Flags from "./Flags";
import BigCities from "./BigCities";
import BigRivers from "./BigRivers";
import ResponsiveAppBar from "./ResponsiveAppBar";
import TransactionExcelConverter from "./Converter";

function App() {
  return (
    <div className="App">
      <ResponsiveAppBar />
      <Routes>
        <Route path="elements" element={<PeriodicElements />} />
        <Route path="flags" element={<Flags />} />
        <Route path="bigCities" element={<BigCities />} />
        <Route path="bigRivers" element={<BigRivers />} />

        <Route
          path="transactionExcelConverter"
          element={<TransactionExcelConverter />}
        />
      </Routes>
    </div>
  );
}

export default App;
