// types/AppointmentType.ts

export interface AppointmentType {
  _id: string
  status: 'waiting' | 'in-progress' | 'done'
  queueNumber: number | null
  labTest?: string
  prescription?: string
  diagnosis?: string
  doctorNote?: string
  createdAt?: string
  updatedAt?: string
  patient: {
    _id: string
    fullName: string
    email?: string
    phone: string
    reason: string
    doctorType: string
  }
}
