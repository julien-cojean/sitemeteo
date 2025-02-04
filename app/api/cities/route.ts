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
