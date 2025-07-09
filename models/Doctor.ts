import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IAdmin extends Document {
  email: string
  password: string
  role: string
  fullName: string
  comparePassword(candidatePassword: string): Promise<boolean>
}

const AdminSchema: Schema<IAdmin> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  fullName: { type: String, required: true },
})

// ✅ Properly typed pre-save hook
AdminSchema.pre<IAdmin>('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// ✅ Password comparison method
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password)
}

const Admin: Model<IAdmin> =
  mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema)

export default Admin
