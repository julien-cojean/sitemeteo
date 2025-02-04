import dbConnect from "@/app/api/connection/dbconnect";
import User, { IUser } from "@/app/api/models/User";
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from "bcryptjs";
import Cors from "cors";

const cors = Cors({
  methods: ["GET", "POST", "OPTIONS"], // Méthodes autorisées
  origin: "*", // Permet toutes les origines (vous pouvez remplacer "*" par un domaine spécifique comme "http://localhost:3000" pour plus de sécurité)
});

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
  await dbConnect();
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "L'utilisateur existe déjà" });
      }

      const hash: string = bcryptjs.hashSync(req.body.password, 10);

      const newUser: IUser = new User({
        name,
        email,
        password: hash,
      });
      await newUser.save();
      res
        .status(201)
        .json({ newUser, message: "nouvel utlisateur sauvegarder" });
    } catch (error) {
      res.status(500).json({ message: "Error saving user" });
    }
  } else {
    res.status(405).json({ message: "Méthode HTTP non autorisée" });
  }
};

export default handler;
