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
const signin = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
  await dbConnect();

  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    try {
      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "utilisateur introuvable" });
      }

      const isMatch = bcryptjs.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      } else {
        res.status(201).json({ user: user, message: "user is connected" });
      }
    } catch (error) {
      res.status(405).json({ message: "Méthode HTTP non autorisée" });
    }
  }
};

export default signin;
