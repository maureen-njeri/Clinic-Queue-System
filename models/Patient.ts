import mongoose, { Schema } from 'mongoose'

const PatientSchema = new Schema(
  {
    fullName: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true, maxlength: 10 },
    email: { type: String, required: false },
    reason: { type: String, required: true },
    doctorType: { type: String, required: true },

    // 🔐 New fields for role-based login
    role: {
      type: String,
      enum: ['admin', 'nurse', 'pharmacist', 'labtech', 'patient'],
      default: 'patient',
    },
    password: {
      type: String,
      required: function () {
        // Require password for staff roles
        return this.role !== 'patient'
      },
    },
  },
  { timestamps: true }
)

export default mongoose.models.Patient ||
  mongoose.model('Patient', PatientSchema)
