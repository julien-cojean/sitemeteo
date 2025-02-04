import {
  TiWeatherShower,
  TiWeatherCloudy,
  TiWeatherSnow,
  TiWeatherSunny,
  TiWeatherWindy,
} from "react-icons/ti";
import { SiAccuweather } from "react-icons/si";
import { MdFoggy } from "react-icons/md";
import { GiFog } from "react-icons/gi";

export default function getWeatherIcon(weatherCondition: string) {
  if (!weatherCondition || typeof weatherCondition !== "string") {
    return <SiAccuweather className="text-gray-400" />; // Icône par défaut si la condition est invalide
  }
  switch (weatherCondition.toLowerCase()) {
    case "clear":
      return (
        <TiWeatherSunny className="text-yellow-600 object-cover w-40 h-40 rounded-t-lg  " />
      );
    case "clouds":
      return (
        <TiWeatherCloudy className="text-gray-700 object-cover w-40 h-40 rounded-t-lg" />
      );
    case "rain":
      return (
        <TiWeatherShower className="text-blue-500 object-cover w-40 h-40 rounded-t-lg  " />
      );
    case "snow":
      return (
        <TiWeatherSnow className="text-gray-500 object-cover w-40 h-40 rounded-t-lg  " />
      );
    case "wind":
      return (
        <TiWeatherWindy className="text-green-500 object-cover w-40 h-40 rounded-t-lg " />
      );
    case "mist":
      return (
        <MdFoggy className="text-gray-500 object-cover w-40 h-40 rounded-t-lg   " />
      );
    case "fog":
      return (
        <GiFog className="text-slate-300 object-cover w-40 h-40 rounded-t-lg   " />
      );
    default:
      return (
        <SiAccuweather className="text-gray-500 object-cover w-40 h-40 rounded-t-lg  " />
      ); // Icône par défaut si aucune condition n'est définie
  }
}
