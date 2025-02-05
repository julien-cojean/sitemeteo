"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SearchCityProps {
  setcity: React.Dispatch<React.SetStateAction<any[]>>; // Déclarez setcity comme prop
  getCity: () => void;
}

const SearchCity: React.FC<SearchCityProps> = ({ setcity, getCity }) => {
  const [cityName, setcityName]: any = useState("");
  const [message, setMessage] = useState<string>("");
  const foundCity = async () => {
    if (cityName === "") {
      return (
        setMessage("Champs de recherche vide"),
        setTimeout(() => setMessage(""), 3000)
      );
    }
    console.log(cityName);
    setMessage("");

    try {
      const city: any = await fetch("api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityName }),
      });
      const data = await city.json();

      if (city.status === 201) {
        setcity((prevCities: any) => [...prevCities, { cityName }]);
        setMessage("ville ajoutée avec succés");
        setTimeout(() => setMessage(""), 3000);
        console.log(data);
      } else if (city.status === 401) {
        setMessage("Votre ville existe déja");
        setTimeout(() => setMessage(""), 3000);
      }
      setcityName("");
      getCity();
    } catch (error) {
      setMessage("Erreur lors de la communication avec le serveur.");
      setTimeout(() => setMessage(""), 3000);
      console.error("Erreur lors de l'ajout de la ville:", error);
    }
  };
  return (
    <section>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="cherche une ville"
          id="cityName"
          onChange={(e) => setcityName(e.target.value)}
          value={cityName}
        />
        <Button type="submit" onClick={() => foundCity()}>
          Rechercher
        </Button>
      </div>
      {message && (
        <div
          className={`mt-2 ${
            message.includes("succés") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </section>
  );
};
export default SearchCity;
