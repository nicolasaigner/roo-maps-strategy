import React, { useState, useRef } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
    const [svgObject, setSvgObject] = useState(null);
    const [mapFile, setMapFile] = useState('/assets/svgs/2A.svg');
    const mapRef = useRef();

    const handleSvgLoad = (object) => {
        setSvgObject(object);
    };

    const handleStartDrawing = () => {
        if (mapRef.current) {
            mapRef.current.startDrawing();
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar setMapFile={setMapFile} onStartDrawing={handleStartDrawing} />
            <div className="flex-1 p-4 flex items-center justify-center">
                <Map ref={mapRef} onLoad={handleSvgLoad} mapFile={mapFile} />
            </div>
        </div>
    );
}

export default App;
