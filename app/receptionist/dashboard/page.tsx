'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function ReceptionistDashboard() {
  const { status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [selectedSlip, setSelectedSlip] = useState<any | null>(null)
  const printRef = useRef(null)

  const [rescheduleId, setRescheduleId] = useState('')
  const [rescheduleForm, setRescheduleForm] = useState({
    reason: '',
    doctorType: '',
  })

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    reason: '',
    doctorType: '',
  })

  const [searchName, setSearchName] = useState('')
  const [searchPhone, setSearchPhone] = useState('')

  const doctorTypes = [
    'Surgeon',
    'Dentist',
    'Pediatrician',
    'Cardiologist',
    'Neurologist',
    'General Physician',
    'Gynecologist',
  ]

  const reasons = [
    'Routine Check-up',
    'Emergency',
    'Surgery Consultation',
    'Follow-up',
    'Lab Results Review',
    'Prescription Renewal',
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchAppointments()
    }
  }, [status])

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointment')
      const data = await res.json()
      setAppointments(data)
    } catch {
      toast.error('Failed to load appointments')
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!form.fullName || !form.phone || !form.reason || !form.doctorType) {
      toast.error('All required fields must be filled')
      return
    }
    if (form.phone.length > 10) {
      toast.error('Phone number must not exceed 10 digits')
      return
    }

    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()
      const data = await res.json()
      toast.success(`Booked! Queue: ${data.queueNumber}`)
      setForm({
        fullName: '',
        phone: '',
        email: '',
        reason: '',
        doctorType: '',
      })
      fetchAppointments()
    } catch {
      toast.error('Booking failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return
    try {
      const res = await fetch(`/api/appointment/${id}/status`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error()
      toast.success('Cancelled')
      fetchAppointments()
    } catch {
      toast.error('Failed to cancel')
    }
  }

  const handlePrint = (appointment: any) => {
    setSelectedSlip(appointment)
    setTimeout(() => {
      window.print()
      setSelectedSlip(null)
    }, 300)
  }

  const handleReschedule = async (id: string) => {
    if (!rescheduleForm.reason || !rescheduleForm.doctorType) {
      toast.error('Please fill in both reason and doctor')
      return
    }

    try {
      const res = await fetch(`/api/appointment/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rescheduleForm),
      })
      if (!res.ok) throw new Error()
      toast.success('Appointment updated')
      setRescheduleId('')
      fetchAppointments()
    } catch {
      toast.error('Failed to reschedule')
    }
  }

  const filteredAppointments = appointments.filter((a) => {
    const nameMatch = a?.patient?.fullName
      ?.toLowerCase()
      .includes(searchName.toLowerCase())
    const phoneMatch = a?.patient?.phone?.includes(searchPhone)
    return nameMatch && phoneMatch
  })

  return (
    <div className='min-h-screen bg-accent text-primary font-sans p-6 print:bg-white'>
      <header className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-primary'>
          Receptionist Dashboard
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700'
        >
          Logout
        </button>
      </header>

      {/* Booking Form */}
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded-xl shadow mb-8'
      >
        <h2 className='text-xl font-semibold mb-4'>📋 Book New Appointment</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <input
            type='text'
            placeholder='Full Name *'
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className='p-3 border border-primary rounded-xl'
            required
          />
          <input
            type='text'
            placeholder='Phone (Max 10) *'
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value.replace(/\D/g, '').slice(0, 10),
              })
            }
            className='p-3 border border-primary rounded-xl'
            required
            maxLength={10}
          />
          <input
            type='email'
            placeholder='Email (optional)'
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className='p-3 border border-primary rounded-xl'
          />
          <select
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className='p-3 border border-primary rounded-xl'
            required
          >
            <option value=''>Select Reason *</option>
            {reasons.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select
            value={form.doctorType}
            onChange={(e) => setForm({ ...form, doctorType: e.target.value })}
            className='p-3 border border-primary rounded-xl'
            required
          >
            <option value=''>Select Doctor *</option>
            {doctorTypes.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='mt-6 bg-primary text-white px-6 py-2 rounded-xl hover:bg-primary-dark'
        >
          ➕ Book Appointment
        </button>
      </form>

      {/* Search Filters */}
      <div className='mb-6 flex flex-wrap gap-4'>
        <input
          type='text'
          placeholder='Search by Name'
          className='p-3 border border-primary rounded-xl'
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type='text'
          placeholder='Search by Phone'
          className='p-3 border border-primary rounded-xl'
          onChange={(e) => setSearchPhone(e.target.value)}
        />
      </div>

      {/* Appointment List */}
      <h2 className='text-xl font-semibold mb-4'>📒 All Bookings</h2>
      <ul className='space-y-4'>
        {filteredAppointments.map((a) => (
          <li key={a._id} className='bg-white p-6 rounded-xl shadow'>
            <p>
              <strong>Name:</strong> {a.patient?.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {a.patient?.phone}
            </p>
            <p>
              <strong>Email:</strong> {a.patient?.email || 'N/A'}
            </p>
            <p>
              <strong>Reason:</strong> {a.patient?.reason}
            </p>
            <p>
              <strong>Doctor:</strong> {a.patient?.doctorType}
            </p>
            <p>
              <strong>Queue No:</strong> {a.queueNumber}
            </p>
            <p>
              <strong>Status:</strong> {a.status}
            </p>

            <div className='flex flex-wrap gap-2 mt-4'>
              <button
                onClick={() => handleDelete(a._id)}
                className='bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 text-sm'
              >
                Cancel
              </button>
              <button
                onClick={() => handlePrint(a)}
                className='bg-green-600 text-white px-3 py-1 rounded-xl hover:bg-green-700 text-sm'
              >
                Print
              </button>
              <button
                onClick={() => {
                  setRescheduleId(a._id)
                  setRescheduleForm({
                    reason: a.patient?.reason || '',
                    doctorType: a.patient?.doctorType || '',
                  })
                }}
                className='bg-yellow-500 text-white px-3 py-1 rounded-xl hover:bg-yellow-600 text-sm'
              >
                Reschedule
              </button>
            </div>

            {rescheduleId === a._id && (
              <div className='mt-4 bg-accent p-4 rounded-xl border'>
                <h4 className='font-semibold mb-2'>Reschedule Appointment</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <select
                    value={rescheduleForm.reason}
                    onChange={(e) =>
                      setRescheduleForm({
                        ...rescheduleForm,
                        reason: e.target.value,
                      })
                    }
                    className='p-2 border border-primary rounded-xl'
                  >
                    <option value=''>New Reason</option>
                    {reasons.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <select
                    value={rescheduleForm.doctorType}
                    onChange={(e) =>
                      setRescheduleForm({
                        ...rescheduleForm,
                        doctorType: e.target.value,
                      })
                    }
                    className='p-2 border border-primary rounded-xl'
                  >
                    <option value=''>New Doctor</option>
                    {doctorTypes.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className='mt-3 flex gap-2'>
                  <button
                    onClick={() => handleReschedule(a._id)}
                    className='bg-blue-600 text-white px-3 py-1 rounded-xl hover:bg-blue-700 text-sm'
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setRescheduleId('')}
                    className='bg-gray-300 text-black px-3 py-1 rounded-xl hover:bg-gray-400 text-sm'
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Print Slip (only one appointment) */}
      {selectedSlip && (
        <div
          ref={printRef}
          className='fixed top-0 left-0 w-full h-full bg-white text-black p-6 z-50 print:block hidden'
        >
          <h2 className='text-xl font-bold mb-4'>Appointment Slip</h2>
          <p>
            <strong>Name:</strong> {selectedSlip.patient?.fullName}
          </p>
          <p>
            <strong>Phone:</strong> {selectedSlip.patient?.phone}
          </p>
          <p>
            <strong>Email:</strong> {selectedSlip.patient?.email}
          </p>
          <p>
            <strong>Reason:</strong> {selectedSlip.patient?.reason}
          </p>
          <p>
            <strong>Doctor:</strong> {selectedSlip.patient?.doctorType}
          </p>
          <p>
            <strong>Queue Number:</strong> {selectedSlip.queueNumber}
          </p>
          <p>
            <strong>Status:</strong> {selectedSlip.status}
          </p>
          <p className='mt-4'>Date: {new Date().toLocaleString()}</p>
        </div>
      )}
    </div>
  )
}
