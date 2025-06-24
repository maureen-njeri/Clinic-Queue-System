import mongoose, { Schema } from 'mongoose'

const AppointmentSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    queueNumber: { type: Number, required: false, default: null },
    status: {
      type: String,
      enum: ['waiting', 'in-progress', 'done'],
      default: 'waiting',
    },
    labTest: { type: String, default: '' }, // ✅ single string field
    prescription: { type: String, default: '' }, // ✅ single string field
    diagnosis: { type: String, default: '' }, // ✅ single string field
    doctorNote: { type: String, default: '' }, // ✅ single string field
    readyForDoctor: { type: Boolean, default: false },
    temperature: String,
    bloodPressure: String,
    weight: String,
    height: String,
    nurseNote: String,

    dispensed: { type: Boolean, default: false },
    pharmacistNote: { type: String },
    dispensedBy: { type: String },
    dispensedAt: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.models.Appointment ||
  mongoose.model('Appointment', AppointmentSchema)
