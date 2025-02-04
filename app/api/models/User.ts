import mongoose, { Document, Schema } from "mongoose";

// Interface représentant un utilisateur
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

// Définition du schéma Mongoose
const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
); // Ajoute des champs de timestamps (createdAt et updatedAt)

// Création du modèle Mongoose avec l'interface IUser
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
