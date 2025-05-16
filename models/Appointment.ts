import mongoose, { Schema } from "mongoose";

const AppointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: "Patient" },
  queueNumber: Number,
  status: { type: String, enum: ["waiting", "in-progress", "done"], default: "waiting" },
}, { timestamps: true });

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
