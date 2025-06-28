import { Weather } from "./Weather";
import { CurrentTime } from "./CurrentTime";
import { useAtom } from "jotai";
import { CurrentTempAtom, MaxTempAtom } from "./atoms";
import { shiftHue, tempToColor } from "./utils";
import { useEffect, useState } from "react";

function App() {
  const [currentTemp] = useAtom(CurrentTempAtom);
  const [maxTemp] = useAtom(MaxTempAtom);
  const [maxSide, setMaxSide] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setMaxSide(Math.max(window.innerWidth, window.innerHeight));
    };
    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const tempsLoaded = currentTemp !== null && maxTemp !== null;

  return (
    <div className="flex relative overflow-hidden text-9xl w-full items-center h-screen">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: maxSide,
          height: maxSide,
          opacity: tempsLoaded ? 1 : 0,
          background: tempsLoaded
            ? `radial-gradient(${tempToColor(currentTemp)} 40%, ${shiftHue(tempToColor(currentTemp), 15)})`
            : "transparent",
        }}
      ></div>
      <div className="w-1/2 flex relative justify-center items-center">
        <CurrentTime />
      </div>
      <div className="w-1/2 flex relative justify-center items-center">
        <Weather />
      </div>
    </div>
  );
}

export default App;
