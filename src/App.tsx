import { Weather } from "./Weather";
import { CurrentTime } from "./CurrentTime";
import { useAtom } from "jotai";
import { CurrentTempAtom, MaxTempAtom } from "./atoms";
import { tempToColor } from "./utils";

function App() {
  const [currentTemp] = useAtom(CurrentTempAtom);
  const [maxTemp] = useAtom(MaxTempAtom);

  const tempsLoaded = currentTemp !== null && maxTemp !== null;

  return <div
      className="flex text-9xl w-full items-center h-screen"
      style={{
        opacity: tempsLoaded ? 1 : 0,
        background: tempsLoaded ? `linear-gradient(to bottom, ${tempToColor(currentTemp)}, ${tempToColor(maxTemp)}` : "transparent",
      }}
    >
      <div className="w-1/2 flex justify-center items-center">
        <CurrentTime />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <Weather />
      </div>
    </div>
}

export default App;
