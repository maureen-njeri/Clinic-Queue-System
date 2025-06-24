'use client'

import { useEffect, useState } from 'react'
import { AppointmentType } from '@/types/AppointmentType'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function PharmacistPanel() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [prescriptions, setPrescriptions] = useState<Record<string, string>>({})

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

  const savePrescription = async (id: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prescription: prescriptions[id] || '' }),
    })
    if (res.ok) {
      toast.success('Prescription saved')
    }
  }

  return (
    <div className='space-y-4'>
      {appointments.map((appt) => (
        <div key={appt._id} className='p-4 border rounded'>
          <div>
            <strong>Name:</strong> {appt.patient?.fullName}
          </div>
          <Input
            placeholder='Enter prescription'
            value={prescriptions[appt._id] || ''}
            onChange={(e) =>
              setPrescriptions({ ...prescriptions, [appt._id]: e.target.value })
            }
          />
          <Button className='mt-2' onClick={() => savePrescription(appt._id)}>
            Save
          </Button>
        </div>
      ))}
    </div>
  )
}
