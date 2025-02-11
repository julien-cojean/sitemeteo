"use client";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import SearchCity from "./SearchCity";
import getWeatherIcon from "../../modules/MeteoIcon";

export default function WeatherCard(props: any) {
  const [city, setcity] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  const getCity = async () => {
    try {
      const response: any = await fetch("/api/cities", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response) {
        console.log("resultat BDD", response);
        const cityTab = await response.json();
        console.log(cityTab, "trad le json");
        setcity(cityTab.weather);
      } else {
        console.error("Erreur lors de la récupération des villes");
      }
    } catch (error) {
      console.log("problème serveur", error);
    }
  };

  useEffect(() => {
    getCity();
  }, []);

  const deleteCity = async (cityId: string) => {
    console.log(cityId);
    try {
      const deleteCard: any = await fetch("api/cities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cityId }),
      });

      const data = await deleteCard.json();

      if (deleteCard.status === 200) {
        console.log("ville supprimé", cityId);
        setMessage("ville supprimée avec succés");
        setTimeout(() => setMessage(""), 3000);
        setcity((prevCities) =>
          prevCities.filter((city) => city._id !== cityId)
        );
      } else {
        console.error("erreur lors de la suppréssion de la ville");
      }
    } catch (error) {
      console.log("probleme serveur", error);
    }
  };

  // console.log("verifiez si city est bien un tab", city);
  return (
    <section className=" flex flex-col w-full justify-center">
      <div className=" flex gap-6 w-full justify-center items-center m-10">
        <SearchCity setcity={setcity} getCity={getCity} />
      </div>
      {message && (
        <div
          className={`-2 flex m-5 text-green-500 justify-center items-center ${message.includes(
            "succés"
          )}`}
        >
          {message}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {city?.map((items: any, index: any) => (
          <div
            key={index}
            className="flex relative items-center bg-emerald-200 border border-gray-200 rounded-lg shadow  md:max-w-md hover:bg-gray-100 overflow-hidden"
          >
            <div className="flex justify-center items-center p-2 w-full md:w-24">
              {getWeatherIcon(items.main)}
            </div>
            <div className="flex flex-col justify-between items-center  p-4 leading-normal w-full">
              <h5 className="m-5 text-2xl font-bold tracking-tight text-gray-900 gap-5  max-w-36 first-letter:uppercase">
                {items.cityName}
                <div className="font-normal items-center justify-center">
                  {items.country}
                </div>
              </h5>
              <p className="mb-3 flex flex-col font-normal items-center justify-center text-gray-700">
                {items.main}
                <span className="flex flex-col font-bold text-black">
                  {items.temperature}°c
                </span>
              </p>

              <button
                className="absolute  top-2 right-2 p-2 justify-center items-center rounded-full bg-gray-200"
                onClick={() => deleteCity(items._id)}
              >
                {" "}
                <RxCross2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
