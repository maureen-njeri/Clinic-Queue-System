import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema({
  name: String,
  phone: String,
}, { timestamps: true });

export default mongoose.models.Patient || mongoose.model("Patient", PatientSchema);
