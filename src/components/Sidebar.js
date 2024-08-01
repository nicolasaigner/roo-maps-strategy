import React from 'react';

const Sidebar = ({ setMapFile, onStartDrawing }) => {
    const handleMapChange = (mapFile) => {
        setMapFile(mapFile);
    };

    return (
        <div className="sidebar p-4 bg-gray-800 h-full flex flex-col items-center shadow-lg">
            <h2 className="text-2xl mb-4 font-bold">Fadegreen (Prontera)</h2>

            <button
                onClick={() => handleMapChange('/assets/svgs/1A.svg')}
                className="mb-2 p-2 bg-blue-500 rounded hover:bg-blue-700"
            >
                Andar 1
            </button>

            <button
                onClick={() => handleMapChange('/assets/svgs/2A.svg')}
                className="mb-2 p-2 bg-blue-500 rounded hover:bg-blue-700"
            >
                Andar 2
            </button>
            <button
                onClick={() => handleMapChange('/assets/svgs/3A.svg')}
                className="mb-2 p-2 bg-blue-500 rounded hover:bg-blue-700"
            >
                Andar 3
            </button>
        </div>
    );
};

export default Sidebar;
