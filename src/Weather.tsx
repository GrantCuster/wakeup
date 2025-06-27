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
        latitude: 52.52,
        longitude: 13.41,
        daily: "temperature_2m_max",
        hourly: "temperature_2m",
        timezone: "America/New_York",
      };
      const url = "https://api.open-meteo.com/v1/forecast";
      const responses = await fetchWeatherApi(url, params);

      // Process first location. Add a for-loop for multiple locations or weather models
      const response = responses[0];

      // Attributes for timezone and location
      const utcOffsetSeconds = response.utcOffsetSeconds();
      // const timezone = response.timezone();
      // const timezoneAbbreviation = response.timezoneAbbreviation();
      // const latitude = response.latitude();
      // const longitude = response.longitude();

      const hourly = response.hourly()!;
      const daily = response.daily()!;

      // Note: The order of weather variables in the URL query and the indices below need to match!
      const weatherData = {
        hourly: {
          time: [
            ...Array(
              (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
            ),
          ].map(
            (_, i) =>
              new Date(
                (Number(hourly.time()) +
                  i * hourly.interval() +
                  utcOffsetSeconds) *
                1000,
              ),
          ),
          temperature2m: hourly.variables(0)!.valuesArray()!,
        },
        daily: {
          time: [
            ...Array(
              (Number(daily.timeEnd()) - Number(daily.time())) /
              daily.interval(),
            ),
          ].map(
            (_, i) =>
              new Date(
                (Number(daily.time()) +
                  i * daily.interval() +
                  utcOffsetSeconds) *
                1000,
              ),
          ),
          temperature2mMax: daily.variables(0)!.valuesArray()!,
        },
      };

      setCurrentTemp(
        Math.round(celsiusToFahrenheit(weatherData.hourly.temperature2m[0])),
      );
      setMaxTemp(
        Math.round(celsiusToFahrenheit(weatherData.daily.temperature2mMax[0])),
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
    }
  }, []);

  return (
    <div className="flex gap-[1ch]">
      <div>{currentTemp}°</div>
      <div>{maxTemp}°</div>
    </div>
  );
}
