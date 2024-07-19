import { useState, useEffect, useRef, useCallback } from 'react'
import data from '../../public/world.json';


const Create = () => {
    const [hoveredPath, setHoveredPath] = useState();
    const [pathsData, setPathsData] = useState([]);
    const [selectedZones, setSelectedZones] = useState([]);
    const [name, setName] = useState();

    const [zoom, setZoom] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const svgRef = useRef(null);
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 50;



    useEffect(() => {
        setPathsData(data);

    }, []);


    const handleZoneClick = (pathData) => {
        setSelectedZones((prevSelectedZones) => {
            if (prevSelectedZones.includes(pathData)) {
                // If pathData exists, remove it
                return prevSelectedZones.filter(zone => zone !== pathData);
            } else {
                // If pathData does not exist, add it
                return [...prevSelectedZones, pathData];
            }
        });
    };

    const handleSaveClick = () => {
        let createdQuizes = JSON.parse(localStorage.getItem('createdQuizes'));
        if(createdQuizes){
            createdQuizes.push({
                name:name,
                zones:selectedZones,
            });
            localStorage.setItem('createdQuizes', JSON.stringify(createdQuizes));
        }
        else{
            createdQuizes = [];
            createdQuizes.push({
                name:name,
                zones:selectedZones,
            });
            localStorage.setItem('createdQuizes', JSON.stringify(createdQuizes));
        }
    };

    const setRef = useCallback((node) => {
        if (node !== null) {
            svgRef.current = node;
        }
    }, []);

    const handleWheel = (e) => {
        e.preventDefault();

        const scaleAmount = 1.2;
        const rect = svgRef.current.getBoundingClientRect();

        // Mouse position relative to the SVG element
        const mouseX = (e.clientX - rect.left) - (rect.width / 2);
        const mouseY = (e.clientY - rect.top) - (rect.height / 2);

        // Calculate the mouse position relative to the current zoom and offset
        const worldX = (mouseX - offsetX) / zoom;
        const worldY = (mouseY - offsetY) / zoom;

        // Calculate new zoom level
        let newZoom = e.deltaY > 0 ? zoom / scaleAmount : zoom * scaleAmount;
        newZoom = Math.min(Math.max(newZoom, MIN_ZOOM), MAX_ZOOM); // Apply zoom thresholds

        // Adjust the offset so the mouse position remains consistent
        setOffsetX(mouseX - worldX * newZoom);
        setOffsetY(mouseY - worldY * newZoom);

        // Set the new zoom level
        setZoom(newZoom);
    };

    const handleMouseDown = (e) => {
        setIsMouseDown(true);
        setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
    };

    const handleMouseMove = (e) => {
        if (isMouseDown) {
            setIsDragging(true);
            if (isDragging) {
                setOffsetX(e.clientX - dragStart.x);
                setOffsetY(e.clientY - dragStart.y);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setIsMouseDown(false);
    };

    useEffect(() => {
        if (svgRef.current) {
            svgRef.current.addEventListener('wheel', handleWheel);
            svgRef.current.addEventListener('mousedown', handleMouseDown);
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            if (svgRef.current) {
                svgRef.current.removeEventListener('wheel', handleWheel);
                svgRef.current.removeEventListener('mousedown', handleMouseDown);
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }
        };
    }, [isDragging, zoom, offsetX, offsetY, dragStart, handleMouseMove, handleMouseUp]);

    return <>
        <div className='w-full flex '>
            <div
                ref={setRef}
                className='bg-gray-200 w-screen h-screen overflow-hidden flex justify-center items-center'>
                <svg
                    baseprofile="tiny"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width=".1"
                    version="1.2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1015 1000"
                    width="700"
                    height="700"
                    style={{
                        transform: `scale(${zoom}) translate(${offsetX / zoom}px, ${offsetY / zoom}px)`,
                        cursor: isDragging ? 'grabbing' : 'default',
                    }}>
                    {pathsData.map((pathData) => (
                        <path
                            key={pathData.id}
                            d={pathData.d}
                            id={pathData.id}
                            name={pathData.name_ar}
                            onMouseEnter={() => setHoveredPath(pathData.id)}
                            onMouseLeave={() => setHoveredPath(undefined)}
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                handleZoneClick(pathData);
                            }}
                            fill={hoveredPath === pathData.id ? 'darkblue' : 'grey'}
                            stroke='white'
                            style={{
                                transition: 'fill 200ms',
                            }}
                        />
                    ))}
                    {pathsData.map((pathData) => pathData.b ? (
                        <path
                            key={pathData.id}
                            d={pathData.b}
                            id={pathData.id}
                            name={pathData.name_ar}
                            onMouseEnter={() => setHoveredPath(pathData.id)}
                            onMouseLeave={() => setHoveredPath(undefined)}
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                handleZoneClick(pathData);
                            }}
                            fill={'transparent'}
                            stroke={hoveredPath === pathData.id ? 'darkblue' : 'grey'}
                            stroke-dasharray="1"
                            strokeWidth='0.2px'
                            style={{
                                opacity: '1',
                                transition: 'fill 200ms',
                            }}
                        />
                    ) : null)}
                    {pathsData.map((pathData) => pathData.cx ? (
                        <circle
                            key={pathData.id}
                            cx={pathData.cx}
                            cy={pathData.cy}
                            r="1"
                            onMouseEnter={() => setHoveredPath(pathData.id)}
                            onMouseLeave={() => setHoveredPath(undefined)}
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                handleZoneClick(pathData);
                            }}
                            fill={hoveredPath === pathData.id ? 'darkblue' : 'grey'}
                            stroke='white'
                            style={{
                                transition: 'fill 200ms',
                            }}
                        />
                    ) : null)}
                    {selectedZones.map((pathData) => (
                        <path
                            key={pathData.id}
                            d={pathData.d}
                            id={pathData.id}
                            name={pathData.name_ar}

                            onDoubleClick={(e) => {
                                e.preventDefault();
                                handleZoneClick(pathData);
                            }}
                            fill='orange'
                            stroke='white'
                        />
                    ))}
                    {selectedZones.map((pathData) => pathData.b ? (
                        <path
                            key={pathData.id}
                            d={pathData.b}
                            id={pathData.id}
                            name={pathData.name_ar}
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                handleZoneClick(pathData);
                            }}
                            fill={'transparent'}
                            stroke='orange'
                            stroke-dasharray="1"
                            strokeWidth='0.2px'
                        />
                    ) : null)}
                    {selectedZones.map((pathData) => pathData.cx ? (
                        <circle
                            key={pathData.id}
                            cx={pathData.cx}
                            cy={pathData.cy}
                            r="1"
                            onDoubleClick={(e) => {
                                e.preventDefault();
                                handleZoneClick(pathData);
                            }}
                            fill='orange'
                            stroke='white'
                        />
                    ) : null)}
                </svg>
            </div>
            <div className='absolute max-w-fit flex flex-col select-none bg-blue-500'>
                <div className='flex items-center'>

                    <button className='bg-blue-200 p-2 rounded-lg text-lg m-2 hover:bg-blue-100'
                        onClick={() => {
                            setPathsData(data);
                            setSelectedZones([]);
                        }}
                    >
                        Reset
                    </button>
                    <h1 className='p-2'>{selectedZones.length} Zones selected</h1>
                    <input className='p-2' type="text" name="" id="" 
                    value={name}
                    onChange={(event)=>{
                        setName(event.target.value);
                    }}/>
                    <button className='bg-blue-200 p-2 rounded-lg text-lg m-2 hover:bg-blue-100'
                        onClick={() => {
                           handleSaveClick();
                        }}
                    >
                        Save
                    </button>
                </div>
                <div className='p-2 max-h-96 overflow-y-scroll'>
                    {
                        selectedZones.map((zone) =>
                        (
                            <h1>
                                {zone.name_ar} / {zone.id}
                            </h1>
                        ))
                    }
                </div>
            </div>

        </div>
    </>;
};

export default Create;