'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function NurseDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])

  const [statusSearch, setStatusSearch] = useState('')
  const [nameSearch, setNameSearch] = useState('')
  const [phoneSearch, setPhoneSearch] = useState('')
  const [doctorSearch, setDoctorSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchAppointments()
      const interval = setInterval(fetchAppointments, 5000)
      return () => clearInterval(interval)
    }
  }, [status, router])

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointment')
      const data = await res.json()
      setAppointments(data)
    } catch {
      toast.error('Failed to load appointments')
    }
  }

  const handleUpdateVitals = async (id: string, vitals: any) => {
    try {
      const res = await fetch(`/api/nurse/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vitals),
      })
      if (!res.ok) throw new Error()
      toast.success('Vitals updated')
      fetchAppointments()
    } catch {
      toast.error('Failed to update vitals')
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/appointment/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error()
      toast.success('Status updated')
      fetchAppointments()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleNotifyDoctor = async (id: string) => {
    try {
      const res = await fetch(`/api/nurse/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readyForDoctor: true }),
      })
      if (!res.ok) throw new Error()
      toast.success('Doctor notified')
      fetchAppointments()
    } catch {
      toast.error('Notification failed')
    }
  }

  const filteredAppointments = appointments.filter((a) => {
    return (
      a.patient?.fullName?.toLowerCase().includes(nameSearch.toLowerCase()) &&
      a.patient?.phone?.includes(phoneSearch) &&
      a.patient?.doctorType
        ?.toLowerCase()
        .includes(doctorSearch.toLowerCase()) &&
      a.status?.toLowerCase().includes(statusSearch.toLowerCase())
    )
  })

  return (
    <div className='min-h-screen bg-accent text-primary font-sans p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Nurse Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700'
        >
          Logout
        </button>
      </div>

      {/* Search Filters */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-6'>
        <input
          placeholder='Search Name'
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className='p-2 border border-primary rounded-xl'
        />
        <input
          placeholder='Search Phone'
          value={phoneSearch}
          onChange={(e) => setPhoneSearch(e.target.value)}
          className='p-2 border border-primary rounded-xl'
        />
        <input
          placeholder='Search Doctor'
          value={doctorSearch}
          onChange={(e) => setDoctorSearch(e.target.value)}
          className='p-2 border border-primary rounded-xl'
        />
        <select
          value={statusSearch}
          onChange={(e) => setStatusSearch(e.target.value)}
          className='p-2 border border-primary rounded-xl'
        >
          <option value=''>All Statuses</option>
          <option value='waiting'>Waiting</option>
          <option value='in-progress'>In Progress</option>
          <option value='done'>Done</option>
        </select>
      </div>

      {/* Appointments */}
      <ul className='space-y-6'>
        {filteredAppointments.map((a) => (
          <li
            key={a._id}
            className='bg-white text-black p-6 rounded-xl shadow space-y-2'
          >
            <p>
              <strong>Queue No:</strong> {a.queueNumber}
            </p>
            <p>
              <strong>Name:</strong> {a.patient?.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {a.patient?.phone}
            </p>
            <p>
              <strong>Doctor:</strong> {a.patient?.doctorType}
            </p>
            <p>
              <strong>Reason:</strong> {a.patient?.reason}
            </p>
            <p>
              <strong>Status:</strong> {a.status}
            </p>

            {(a.status === 'waiting' || a.status === 'in-progress') && (
              <>
                <VitalsForm
                  appointmentId={a._id}
                  onSubmit={handleUpdateVitals}
                />
                <div className='mt-3'>
                  <label className='block font-semibold mb-1'>
                    Update Status
                  </label>
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a._id, e.target.value)}
                    className='p-2 border border-primary rounded-xl'
                  >
                    <option value='waiting'>Waiting</option>
                    <option value='in-progress'>In Progress</option>
                  </select>
                </div>

                {/* ✅ Notify Doctor */}
                <div className='mt-3'>
                  <button
                    onClick={() => handleNotifyDoctor(a._id)}
                    disabled={a.readyForDoctor}
                    className={`px-4 py-2 rounded-xl ${
                      a.readyForDoctor
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {a.readyForDoctor ? 'Doctor Notified ✅' : 'Notify Doctor'}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
        {filteredAppointments.length === 0 && (
          <p className='text-gray-500 text-center mt-6'>
            No appointments match the filters.
          </p>
        )}
      </ul>
    </div>
  )
}

function VitalsForm({ appointmentId, onSubmit }: any) {
  const [form, setForm] = useState({
    temperature: '',
    bloodPressure: '',
    weight: '',
    height: '',
    nurseNote: '',
  })

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSubmit(appointmentId, form)
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-3'>
      <input
        name='temperature'
        placeholder='Temperature (°C)'
        className='p-2 border border-primary rounded-xl'
        value={form.temperature}
        onChange={handleChange}
      />
      <input
        name='bloodPressure'
        placeholder='Blood Pressure (e.g., 120/80)'
        className='p-2 border border-primary rounded-xl'
        value={form.bloodPressure}
        onChange={handleChange}
      />
      <input
        name='weight'
        placeholder='Weight (kg)'
        className='p-2 border border-primary rounded-xl'
        value={form.weight}
        onChange={handleChange}
      />
      <input
        name='height'
        placeholder='Height (cm)'
        className='p-2 border border-primary rounded-xl'
        value={form.height}
        onChange={handleChange}
      />
      <textarea
        name='nurseNote'
        placeholder='Nurse Observations'
        className='col-span-2 p-2 border border-primary rounded-xl resize-none'
        rows={3}
        value={form.nurseNote}
        onChange={handleChange}
      />
      <button
        onClick={handleSubmit}
        className='col-span-2 bg-primary text-white py-2 rounded-xl hover:bg-primary-dark'
      >
        Save Vitals
      </button>
    </div>
  )
}
