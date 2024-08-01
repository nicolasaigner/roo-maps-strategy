import React, { useRef, useState, useEffect } from 'react';
import { BsEraserFill, BsPencilFill } from 'react-icons/bs';
import { FaDownload } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

const Map = ({ mapFile }) => {
    const svgRef = useRef(null);
    const mapRef = useRef(null);
    const [lines, setLines] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [currentColor, setCurrentColor] = useState('red');
    const [showColors, setShowColors] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];

    useEffect(() => {
        const updateCanvasSize = () => {
            const mapImage = mapRef.current;
            if (mapImage) {
                setCanvasSize({ width: mapImage.naturalWidth, height: mapImage.naturalHeight });
            }
        };

        const imgElement = mapRef.current;
        imgElement.addEventListener('load', updateCanvasSize);

        return () => {
            imgElement.removeEventListener('load', updateCanvasSize);
        };
    }, [mapFile]);

    const handleMouseDown = (event) => {
        setDrawing(true);
        const svg = svgRef.current;
        const point = getSvgPoint(event, svg);
        setLines((prevLines) => [...prevLines, { points: [point], color: currentColor }]);
    };

    const handleMouseMove = (event) => {
        if (!drawing) return;
        const svg = svgRef.current;
        const point = getSvgPoint(event, svg);
        setLines((prevLines) => {
            const updatedLines = [...prevLines];
            updatedLines[updatedLines.length - 1].points.push(point);
            return updatedLines;
        });
    };

    const handleMouseUp = () => {
        setDrawing(false);
    };

    const getSvgPoint = (event, svg) => {
        const point = svg.createSVGPoint();
        point.x = event.clientX - svg.getBoundingClientRect().left;
        point.y = event.clientY - svg.getBoundingClientRect().top;
        return point;
    };

    const clearDrawing = () => {
        setLines([]);
    };

    const handleColorChange = (color) => {
        setCurrentColor(color);
        setShowColors(false); // Fecha o menu de cores ao selecionar uma cor
    };

    const downloadAsPNG = () => {
        const { width, height } = canvasSize;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        // Carregar a imagem do mapa no canvas
        const image = new Image();
        image.crossOrigin = 'anonymous'; // Para lidar com problemas de CORS, se necessário
        image.onload = () => {
            context.drawImage(image, 0, 0, width, height);

            // Desenhar os traços no canvas
            context.lineWidth = 6;
            lines.forEach((line) => {
                context.beginPath();
                context.strokeStyle = line.color;
                line.points.forEach((point, index) => {
                    const x = (point.x / svgRef.current.clientWidth) * width;
                    const y = (point.y / svgRef.current.clientHeight) * height;
                    if (index === 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }
                });
                context.stroke();
            });

            // Criar o elemento <a> para download
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'map_drawing.png';
            link.click();
        };
        image.src = mapFile;
    };

    return (
        <div
            className="map-container relative flex-1 border-2 border-gray-700 rounded-lg overflow-hidden shadow-lg"
            style={{ width: '98vh', height: '98vh', padding: '10px', margin: '10px' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <img
                ref={mapRef}
                src={mapFile}
                alt="Mapa Interativo"
                className="w-full h-full"
                style={{ pointerEvents: 'none' }}
            />
            <svg
                ref={svgRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-auto"
            >
                {lines.map((line, index) => (
                    <polyline
                        key={index}
                        points={line.points.map(p => `${p.x},${p.y}`).join(' ')}
                        stroke={line.color}
                        strokeWidth="6"
                        fill="none"
                    />
                ))}
            </svg>

            <div className="absolute top-2 right-2 flex flex-col items-center space-y-2">
                <div
                    className="relative"
                    onMouseEnter={() => setShowColors(true)}
                    onMouseLeave={() => setShowColors(true)}
                >
                    <button className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
                        <BsPencilFill color={currentColor} />
                    </button>
                    {showColors && (
                        <div className="absolute right-full mr-2 flex flex-row space-x-2 transition-all duration-300">
                            {colors.map((color) => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange(color)}
                                    onMouseEnter={() => setShowColors(true)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={clearDrawing}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700"
                    data-tooltip-id="my-tooltip" data-tooltip-content="Apagar todas as linhas"
                >
                    <BsEraserFill />
                </button>

                <Tooltip id="my-tooltip" />

                <button
                    onClick={downloadAsPNG}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 mt-2"
                    data-tooltip-id="download-tooltip" data-tooltip-content="Baixar como PNG"
                >
                    <FaDownload />
                </button>

                <Tooltip id="download-tooltip" />
            </div>
        </div>
    );
};

export default Map;
