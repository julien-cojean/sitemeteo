import { NextResponse } from "next/server";
import dbConnect from "@/app/api/connection/dbconnect";
import City from "@/app/api/models/Cities";

// Gestion de la requête GET
export async function GET() {
  try {
    await dbConnect();
    const allCities = await City.find({});

    return NextResponse.json(
      { weather: allCities, message: "Villes récupérées avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors du chargement des villes", error },
      { status: 500 }
    );
  }
}
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json(); // Extraction des données envoyées

    if (!id) {
      return NextResponse.json(
        { message: "ID requis pour supprimer la ville" },
        { status: 400 }
      );
    }

    const deletedCity = await City.findByIdAndDelete(id);

    if (!deletedCity) {
      return NextResponse.json(
        { message: "Ville non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Ville supprimée avec succès", deletedCity },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la suppression", error },
      { status: 500 }
    );
  }
}
const apiKey = process.env.API_KEY;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { cityName } = await req.json();
    console.log("Nom de ville reçu:", cityName);

    if (!cityName) {
      return NextResponse.json(
        { error: "Champ de recherche vide ou ville inexistante" },
        { status: 400 }
      );
    }

    // Vérifier si la ville existe déjà dans la BDD
    const existingCity = await City.findOne({
      cityName: { $regex: new RegExp(cityName, "i") },
    });

    if (existingCity) {
      console.log("Ville déjà en base de données:", existingCity);
      return NextResponse.json(
        { message: "Ville déjà ajoutée" },
        { status: 401 }
      );
    }

    // Récupérer les données météo depuis OpenWeather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "Ville introuvable" },
        { status: 404 }
      );
    }

    const cityData = await response.json();
    console.log("Données OpenWeather:", cityData);

    // Création de la ville en base de données
    const newCity = new City({
      cityName,
      main: cityData.weather[0].main,
      description: cityData.weather[0].description,
      country: cityData.sys.country,
      temperature: cityData.main.temp,
      tempMin: cityData.main.temp_min,
      tempMax: cityData.main.temp_max,
    });

    await newCity.save();
    console.log("Nouvelle ville ajoutée en BDD:", newCity);

    return NextResponse.json(
      { newCity, message: "Nouvelle ville ajoutée" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout de la ville:", error);
    return NextResponse.json(
      { error: error, message: "Erreur lors de l'ajout" },
      { status: 500 }
    );
  }
}
