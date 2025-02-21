import { NextResponse } from "next/server";
import dbConnect from "@/app/api/connection/dbconnect";
import User from "../../models/User";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, password } = await req.json();

    // Vérifier que tous les champs sont remplis
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Créer le nouvel utilisateur
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { message: "Erreur serveur", error },
      { status: 500 }
    );
  }
}
