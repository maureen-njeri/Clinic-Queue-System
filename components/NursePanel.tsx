'use client'

import { useEffect, useState } from 'react'
import { AppointmentType } from '@/types/AppointmentType'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateStatus } from '@/lib/actions'

export default function NursePanel() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    const res = await fetch('/api/appointments')
    const data = await res.json()
    setAppointments(data)
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatus(id, newStatus)
    fetchData()
  }

  return (
    <div className='overflow-x-auto space-y-4'>
      {appointments.map((appt) => (
        <div key={appt._id} className='p-4 border rounded'>
          <div>
            <strong>Name:</strong> {appt.patient?.fullName}
          </div>
          <div>
            <strong>Phone:</strong> {appt.patient?.phone}
          </div>
          <div>
            <strong>Status:</strong> {appt.status}
          </div>
          <div className='space-x-2 mt-2'>
            <Button onClick={() => handleStatusChange(appt._id, 'waiting')}>
              Waiting
            </Button>
            <Button onClick={() => handleStatusChange(appt._id, 'in-progress')}>
              In Progress
            </Button>
            <Button onClick={() => handleStatusChange(appt._id, 'done')}>
              Done
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
