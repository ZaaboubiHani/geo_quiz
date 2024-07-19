import { useState, useEffect, useRef, useCallback, useContext } from "react";
import data from "../../public/world.json";
import labelsData from "../../public/labels.json";
import { useParams } from "react-router-dom";
import { getImageURL } from "../utils/image-utils";
import LanguageDropdown from "../components/LaguageDropdown";
import { LanguageContext } from "../contexts/LanguageContext";
const Quiz = () => {
  const { language } = useContext(LanguageContext);
  const { id } = useParams();
  const [hoveredPath, setHoveredPath] = useState();
  const [randomZone, setRandomZone] = useState();
  const [pathsData, setPathsData] = useState([]);
  const [nullZones, setNullZones] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [mistakesNum, setMistakesNum] = useState(0);
  const [mistakeLabel, setMistakeLabel] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

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
    if (id === "world") {
      setPathsData(data);
      selectRandomZone(data, correctAnswers);
    } else {
      let createdQuizes = JSON.parse(localStorage.getItem("createdQuizes"));
      let currentQuiz = createdQuizes.filter((quiz) => quiz.name === id)[0];

      setPathsData(currentQuiz.zones);
      selectRandomZone(currentQuiz.zones, correctAnswers);
      setNullZones(data);
    }
    setIsActive(true);
  }, []);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (seconds === 59) {
          setSeconds(0);
          setMinutes((prev) => prev + 1);
        } else {
          setSeconds((prev) => prev + 1);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isActive, minutes, seconds]);

  useEffect(() => {
    if (mistakesNum) {
      setMistakeLabel(true);

      const timer = setTimeout(() => {
        setMistakeLabel(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [mistakesNum]);

  useEffect(() => {
    if (id === "world") {
      if (correctAnswers.length === data.length) {
        setIsActive(false);
        setIsFinished(true);
      }
    } else {
      let createdQuizes = JSON.parse(localStorage.getItem("createdQuizes"));
      let currentQuiz = createdQuizes.filter((quiz) => quiz.name === id)[0];
      if (currentQuiz.zones.length === correctAnswers.length) {
        setIsActive(false);
        setIsFinished(true);
      }
    }
  }, [correctAnswers]);

  const selectRandomZone = (data, correctAnswers) => {
    console.log(data);
    const remainingZones = data.filter(
      (zone) => !correctAnswers.some((answer) => answer.id === zone.id)
    );

    if (remainingZones.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingZones.length);
      setRandomZone(remainingZones[randomIndex]);
    } else {
      setRandomZone(null);
    }
  };

  const handleZoneClick = (pathData) => {
    setPathsData((prevPathsData) =>
      prevPathsData.filter(
        (item) =>
          !correctAnswers.some((correctItem) => correctItem.id === item.id)
      )
    );
    if (pathData.id === randomZone?.id) {
      setCorrectAnswers((prevCorrectAnswers) => {
        const newCorrectAnswers = [...prevCorrectAnswers, pathData];
        setPathsData((prevPathsData) =>
          prevPathsData.filter(
            (item) =>
              !newCorrectAnswers.some(
                (correctItem) => correctItem.id === item.id
              )
          )
        );

        if (id === "world") {
          selectRandomZone(data, newCorrectAnswers);
        } else {
          let createdQuizes = JSON.parse(localStorage.getItem("createdQuizes"));
          let currentQuiz = createdQuizes.filter((quiz) => quiz.name === id)[0];
          selectRandomZone(currentQuiz.zones, newCorrectAnswers);
        }

        return newCorrectAnswers;
      });
    } else {
      setMistakesNum((prev) => prev + 1);
      if (id === "world") {
        selectRandomZone(data, correctAnswers);
      } else {
        let createdQuizes = JSON.parse(localStorage.getItem("createdQuizes"));
        let currentQuiz = createdQuizes.filter((quiz) => quiz.name === id)[0];
        selectRandomZone(currentQuiz.zones, correctAnswers);
      }
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
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

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
      svgRef.current.addEventListener("wheel", handleWheel);
      svgRef.current.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (svgRef.current) {
        svgRef.current.removeEventListener("wheel", handleWheel);
        svgRef.current.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [
    isDragging,
    zoom,
    offsetX,
    offsetY,
    dragStart,
    handleMouseMove,
    handleMouseUp,
  ]);

  return (
    <>
      <div className="w-full flex">
        <div
          ref={setRef}
          className="bg-gray-200 w-screen h-screen overflow-hidden flex justify-center items-center"
        >
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
              transform: `scale(${zoom}) translate(${offsetX / zoom}px, ${
                offsetY / zoom
              }px)`,
              cursor: isDragging ? "grabbing" : "default",
            }}
          >
            {nullZones.map((pathData) => (
              <path
                key={pathData.id}
                d={pathData.d}
                id={pathData.id}
                name={pathData[language]}
                fill="black"
                stroke="white"
              />
            ))}
            {pathsData.map((pathData) => (
              <path
                key={pathData.id}
                d={pathData.d}
                id={pathData.id}
                name={pathData[language]}
                onMouseEnter={() => setHoveredPath(pathData.id)}
                onMouseLeave={() => setHoveredPath(undefined)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  handleZoneClick(pathData);
                }}
                fill={hoveredPath === pathData.id ? "darkblue" : "grey"}
                stroke="white"
                style={{
                  transition: "fill 200ms",
                }}
              />
            ))}

            {correctAnswers.map((pathData) => (
              <path
                key={pathData.id}
                d={pathData.d}
                id={pathData.id}
                name={pathData[language]}
                fill="green"
                stroke="white"
                style={{
                  transition: "fill 200ms",
                }}
              />
            ))}
            {pathsData.map((pathData) =>
              pathData.b ? (
                <path
                  key={pathData.id}
                  d={pathData.b}
                  id={pathData.id}
                  name={pathData[language]}
                  onMouseEnter={() => setHoveredPath(pathData.id)}
                  onMouseLeave={() => setHoveredPath(undefined)}
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    handleZoneClick(pathData);
                  }}
                  fill={"transparent"}
                  stroke={hoveredPath === pathData.id ? "darkblue" : "grey"}
                  stroke-dasharray="1"
                  strokeWidth="0.2px"
                  style={{
                    opacity: "1",
                    transition: "fill 200ms",
                  }}
                />
              ) : null
            )}
            {pathsData.map((pathData) =>
              pathData.cx ? (
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
                  fill={hoveredPath === pathData.id ? "darkblue" : "grey"}
                  stroke="white"
                  style={{
                    transition: "fill 200ms",
                  }}
                />
              ) : null
            )}
          </svg>
        </div>
        <div
          className={`absolute max-w-fit flex justify-between select-none bg-blue-500 ${
            language === "ar" ? "flex-row-reverse right-0" : ""
          }`}
        >
          <h1
            className={`bg-white p-2 rounded-lg text-lg m-2 w-[450px] ${
              language === "ar" ? "text-right" : ""
            }`}
          >
            {labelsData.findLabel[language]}
            {randomZone ? randomZone[language] : ""}
          </h1>
          <button
            className="bg-blue-200 p-2 rounded-lg text-lg m-2 hover:bg-blue-100"
            onClick={() => {
              if (id === "world") {
                selectRandomZone(data, correctAnswers);
              } else {
                let createdQuizes = JSON.parse(
                  localStorage.getItem("createdQuizes")
                );
                let currentQuiz = createdQuizes.filter(
                  (quiz) => quiz.name === id
                )[0];
                selectRandomZone(currentQuiz.zones, correctAnswers);
              }
            }}
          >
            {labelsData.skipLabel[language]}
          </button>
          <h1 className="bg-white p-2 rounded-lg text-lg m-2">
            {correctAnswers.length} / {pathsData.length + correctAnswers.length}
          </h1>
          <h1 className="bg-white p-2 rounded-lg text-lg m-2">
            {labelsData.mistakesLabel[language]}
            {mistakesNum}
          </h1>
          <button
            className="bg-blue-200 p-2 rounded-lg text-lg m-2 hover:bg-blue-100"
            onClick={() => {
              if (id === "world") {
                setPathsData(data);
                selectRandomZone(data, correctAnswers);
              } else {
                let createdQuizes = JSON.parse(
                  localStorage.getItem("createdQuizes")
                );
                let currentQuiz = createdQuizes.filter(
                  (quiz) => quiz.name === id
                )[0];
                setPathsData(currentQuiz.zones);
                selectRandomZone(currentQuiz.zones, correctAnswers);
                setNullZones(data);
              }
              setCorrectAnswers([]);
              setMistakesNum(0);
              setSeconds(0);
              setMinutes(0);
              setMistakeLabel(false);
              setIsFinished(false);
              setIsActive(true);
            }}
          >
            {labelsData.resetLabel[language]}
          </button>
          <div className="text-xl flex items-center m-4">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <button
            className="bg-blue-200 p-2 rounded-lg text-lg m-2 hover:bg-blue-100"
            onClick={() => {
              setIsActive(false);
              setIsFinished(true);
            }}
          >
            {labelsData.stopLabel[language]}
          </button>
          <LanguageDropdown />
        </div>
        <img
          src={getImageURL(randomZone?.id)}
          alt=""
          className={`absolute top-16 h-24 select-none ${
            language === "ar" ? "right-2" : "left-2"
          }`}
        />
        {mistakeLabel ? (
          <div
            className={`absolute max-w-fit flex justify-center select-none top-40 font-bold ${
              language === "ar" ? "right-2" : "left-2"
            }`}
          >
            <h1 className="text-lg text-red-500 ">
              {labelsData.incorrectTryAgainLabel[language]}
            </h1>
          </div>
        ) : undefined}
        {isFinished ? (
          <div
            className="bg-blue-500 p-4"
            style={{
              minWidth: "200px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <h1 className="text-3xl font-bold mb-4">
              {labelsData.scoreLabel[language]}
            </h1>
            <h1 className="text-lg">
              {labelsData.numberOfCorrectAnswersLabel[language]}
              {correctAnswers.length}
            </h1>
            <h1 className="text-lg">
              {labelsData.numberOfMistakesLabel[language]}
              {mistakesNum}
            </h1>
            <h1 className="text-lg">
              {labelsData.timeLabel[language]}
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </h1>
            <h1 className="text-lg">
              {labelsData.percentageLabel[language]}
              {(
                (correctAnswers.length /
                  (mistakesNum + correctAnswers.length !== 0
                    ? mistakesNum + correctAnswers.length
                    : 1)) *
                100
              ).toFixed(2)}
              %
            </h1>
          </div>
        ) : undefined}
      </div>
    </>
  );
};

export default Quiz;
