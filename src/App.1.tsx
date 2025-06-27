import { CurrentTime } from "./CurrentTime";
import { Weather } from "./Weather";

export function App() {
  const [currentTemp] = useAtom(CurrentTempAtom);


  return (
    <div className="flex w-full items-center h-screen">
      <div className="w-1/2 flex justify-center items-center">
        <CurrentTime />
      </div>
      <div className="w-1/2 flex justify-center items-center">
        <Weather />
      </div>
    </div>
  );
}

