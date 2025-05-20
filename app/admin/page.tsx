'use client'

import { useEffect, useState } from 'react'

interface Patient {
  name: string
  phone: string
}

interface Appointment {
  _id: string
  patient: Patient
  queueNumber: number
  status: string
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])

  const fetchAppointments = async () => {
    const res = await fetch('/api/appointments')
    const data = await res.json()
    setAppointments(data)
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchAppointments()
  }

  useEffect(() => {
    fetchAppointments()
    const interval = setInterval(fetchAppointments, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Admin Queue Dashboard</h1>
      {appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className='space-y-4'>
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className='p-4 border rounded shadow-sm bg-white'
            >
              <p>
                <strong>{appt.patient.name}</strong> ({appt.patient.phone})
              </p>
              <p>
                Queue #: <strong>{appt.queueNumber}</strong>
              </p>
              <p>
                Status: <span className='capitalize'>{appt.status}</span>
              </p>

              <div className='mt-2 space-x-2'>
                {appt.status !== 'in-progress' && (
                  <button
                    onClick={() => updateStatus(appt._id, 'in-progress')}
                    className='bg-yellow-500 text-white px-3 py-1 rounded'
                  >
                    In Progress
                  </button>
                )}
                {appt.status !== 'done' && (
                  <button
                    onClick={() => updateStatus(appt._id, 'done')}
                    className='bg-green-600 text-white px-3 py-1 rounded'
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
