import mongoose, { Schema } from 'mongoose'

const auditLogSchema = new Schema({
  action: String,
  actorEmail: String,
  targetUserId: String,
  timestamp: { type: Date, default: Date.now },
})

export default mongoose.models.AuditLog ||
  mongoose.model('AuditLog', auditLogSchema)
