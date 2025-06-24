import mongoose, { Schema, models, model } from 'mongoose'

const LabTestSchema = new Schema(
  {
    patientName: { type: String, required: true },
    testType: { type: String, required: true },
    result: { type: String },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    fileUrl: { type: String },
  },
  { timestamps: true }
)

export default models.LabTest || model('LabTest', LabTestSchema)
