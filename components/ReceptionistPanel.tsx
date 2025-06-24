'use client'

import { useEffect, useState } from 'react'
import { AppointmentType } from '@/types/AppointmentType'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function ReceptionistPanel() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([])
  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')
  const [searchDoctor, setSearchDoctor] = useState('')

  useEffect(() => {
    fetchAppointments()
    const interval = setInterval(fetchAppointments, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments')
    const data = await res.json()
    setAppointments(data)
  }

  const filtered = appointments.filter(
    (a) =>
      a.patient?.fullName?.toLowerCase().includes(searchName.toLowerCase()) &&
      a.patient?.phone?.includes(searchPhone) &&
      a.patient?.doctor?.toLowerCase().includes(searchDoctor.toLowerCase())
  )

  return (
    <div className='p-4 space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Input
          placeholder='Search Name'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <Input
          placeholder='Search Phone'
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <Input
          placeholder='Search Doctor'
          value={searchDoctor}
          onChange={(e) => setSearchDoctor(e.target.value)}
        />
      </div>

      {filtered.map((appt, i) => (
        <Card key={appt._id}>
          <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-2 p-4'>
            <div>
              <strong>Queue:</strong> {i + 1}
            </div>
            <div>
              <strong>Name:</strong> {appt.patient?.fullName}
            </div>
            <div>
              <strong>Phone:</strong> {appt.patient?.phone}
            </div>
            <div>
              <strong>Reason:</strong> {appt.patient?.reason}
            </div>
            <div>
              <strong>Doctor:</strong> {appt.patient?.doctor}
            </div>
            <div>
              <strong>Status:</strong> {appt.status}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
