import dbConnect from "@/app/api/connection/dbconnect";
import City, { ICities } from "@/app/api/models/Cities";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
const cors = Cors({
  methods: ["GET", "POST", "DELETE"], // Méthodes autorisées
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

const deleteCity = async (req: NextApiRequest, res: NextApiResponse) => {
  await runMiddleware(req, res, cors);
  await dbConnect();

  if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      const supp = await City.deleteOne({
        _id: id,
      });
      if (!supp) {
        return res.status(404).json({ message: "Ville non trouvée" });
      }
      return res
        .status(200)
        .json({ message: "Ville supprimée avec succès", supp });
    } catch (error) {
      res.status(500).json({ error, message: "erreur lors de la suppresion" });
    }
  } else {
    res.status(405).json({ message: "Méthode HTTP non autorisée" });
  }
};
export default deleteCity;
