import dbConnect from "@/app/api/connection/dbconnect";
import City, { ICities } from "@/app/api/models/Cities";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";

const apiKey = process.env.API_KEY;
// Initialiser CORS
const cors = Cors({
  methods: ["GET", "POST", "OPTIONS"], // Méthodes autorisées
  origin: "*", // Permet toutes les origines (vous pouvez remplacer "*" par un domaine spécifique comme "http://localhost:3000" pour plus de sécurité)
});

// Fonction pour exécuter le middleware CORS
function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const addCity = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
  await dbConnect();
  if (req.method === "POST") {
    const { cityName } = req.body;
    console.log("nom de ville reçu", cityName);
    if (!cityName) {
      return res
        .status(400)
        .json({ error: "champs de recherche vide ou ville inexistante" });
    }
    try {
      const existingCity = await City.findOne({
        cityName: { $regex: new RegExp(cityName, "i") },
      });
      if (existingCity) {
        console.log("Vérification de l'existence de la ville:", existingCity);
        return res.status(401).json({ message: "ville déja ajouté" });
      }
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        return res.status(404).json({ message: "Ville introuvable" });
      }
      const cityData = await response.json();
      console.log("test", cityData.main.temp);
      console.log("réponse de openweatherapp", cityData);
      const newCity: ICities = new City({
        cityName,
        main: cityData.weather[0].main,
        description: cityData.weather[0].description,
        country: cityData.sys.country,
        temperature: cityData.main.temp,
        tempMin: cityData.main.temp_min,
        tempMax: cityData.main.temp_max,
      });
      await newCity.save();
      console.log("nouvelle elemente ajouté en BDD", newCity);
      res.status(201).json({ newCity, message: "nouvelle ville ajoutée" });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la ville:", error);
      res.status(500).json({
        error,
        message: "erreur lors de l'ajout de la nouvelle ville",
      });
    }
  } else {
    res.status(405).json({ message: "Méthode HTTP non autorisée" });
  }
};

export default addCity;
