import { fetchWeatherApi } from "openmeteo";
import { useEffect, useRef } from "react";
import { celsiusToFahrenheit } from "./utils";
import { useAtom } from "jotai";
import { CurrentTempAtom, MaxTempAtom } from "./atoms";

export function Weather() {
  const [currentTemp, setCurrentTemp] = useAtom(CurrentTempAtom);
  const [maxTemp, setMaxTemp] = useAtom(MaxTempAtom);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    async function main() {
      const params = {
        latitude: 40.63725026000651,
        longitude: -73.97012580267547,
        timezone: "America/New_York",
        current: "temperature_2m",
        daily: "temperature_2m_max",
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);
      const response = responses[0];

      const current = response.current()!;
      const daily = response.daily()!;

      setCurrentTemp(
        Math.round(celsiusToFahrenheit(current.variables(0)!.value())),
      );
      setMaxTemp(
        Math.round(celsiusToFahrenheit(daily.variables(0)!.valuesArray()![0])),
      );
    }
    intervalRef.current = window.setInterval(() => {
      main();
    }, 60000); // Update every minute
    main();
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex gap-[1ch]">
      <div>{currentTemp}°</div>
      <div>{maxTemp}°</div>
    </div>
  );
}
