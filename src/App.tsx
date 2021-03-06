import React from 'react';
import './App.css';
import {Routes, Route} from "react-router-dom";
import PeriodicElements from './PeriodicElements';
import Flags from './Flags';
import ResponsiveAppBar from "./ResponsiveAppBar";

function App() {
    return (
        <div className="App">
            <ResponsiveAppBar/>
            <Routes>
                <Route path="elements" element={<PeriodicElements/>}/>
                <Route path="flags" element={<Flags/>}/>
            </Routes>
        </div>
    );
}

export default App;
