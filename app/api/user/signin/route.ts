import { NextResponse } from "next/server";
import dbConnect from "@/app/api/connection/dbconnect";
import User from "../../models/User";
import bcryptjs from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "utilisateur introuvable" },
        { status: 400 }
      );
    }

    const isMatch = bcryptjs.compareSync(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Mot de passe incorrect" },
        { status: 401 }
      );
    } else {
      return NextResponse.json(
        { user: user, message: "user is connected" },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Erreur lors de la suppression", error },
      { status: 500 }
    );
  }
}
