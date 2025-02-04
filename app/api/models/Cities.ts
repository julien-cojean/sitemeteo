import mongoose, { Document, Schema } from "mongoose";

export interface ICities extends Document {
  cityName: String;
  main: String;
  description: String;
  tempMin: Number;
  tempMax: Number;
}

const citySchema = new Schema({
  cityName: { type: String, required: true },
  main: { type: String, required: true },
  description: { type: String, required: true },
  country: { type: String, required: true },
  temperature: { type: Number, required: true },
  tempMin: { type: Number, required: true },
  tempMax: { type: Number, required: true },
});

const City =
  mongoose.models.cities || mongoose.model<ICities>("cities", citySchema);

export default City;
