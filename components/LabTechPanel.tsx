'use client'

import { useEffect, useState } from 'react'
import { AppointmentType } from '@/types/AppointmentType'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LabTechPanel() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [labTests, setLabTests] = useState<Record<string, string>>({})

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

  const saveLabTest = async (id: string) => {
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ labTest: labTests[id] || '' }),
    })
    if (res.ok) {
      toast.success('Lab test saved')
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
            placeholder='Enter lab test'
            value={labTests[appt._id] || ''}
            onChange={(e) =>
              setLabTests({ ...labTests, [appt._id]: e.target.value })
            }
          />
          <Button className='mt-2' onClick={() => saveLabTest(appt._id)}>
            Save
          </Button>
        </div>
      ))}
    </div>
  )
}
