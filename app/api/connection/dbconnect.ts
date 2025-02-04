import mongoose from "mongoose";

const connectionString: string = process.env.CONNECTION_STRING || "";

if (!connectionString) {
  throw new Error(
    "La variable d'environnement CONNECTION_STRING est manquante"
  );
}

const dbConnect = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    console.log("Déjà connecté à MongoDB");
    return;
  }

  try {
    await mongoose.connect(connectionString, {
      connectTimeoutMS: 2000,
    });
    console.log("✅ Connexion à la base de données réussie");
  } catch (error) {
    console.error("❌ Erreur de connexion à MongoDB :", error);
    process.exit(1);
  }
};

export default dbConnect;
