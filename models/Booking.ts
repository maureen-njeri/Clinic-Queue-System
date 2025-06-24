// models/Booking.ts
import mongoose, { Schema, model, models } from 'mongoose'

interface IBooking {
  fullName: string
  phone: string
  reason: string
  queueNumber: number
  status: 'waiting' | 'served'
  createdAt: Date
}

const bookingSchema = new Schema<IBooking>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    reason: { type: String, required: true },
    queueNumber: { type: Number, required: true },
    status: { type: String, enum: ['waiting', 'served'], default: 'waiting' },
  },
  { timestamps: true }
)

export default models.Booking || model<IBooking>('Booking', bookingSchema)
