'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    reason: '',
    doctor: 'All',
  })
  const [edited, setEdited] = useState<Record<string, any>>({})
  const [isEditing, setIsEditing] = useState(false)

  const doctorTypes = [
    'All',
    'Surgeon',
    'Dentist',
    'Pediatrician',
    'Cardiologist',
    'Neurologist',
    'General Physician',
    'Gynecologist',
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (
      status === 'authenticated' &&
      (!session?.user?.role || session.user.role.toLowerCase() !== 'doctor')
    ) {
      router.push('/login')
    }
  }, [status, session, router])

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointment')
      const data = await res.json()
      setAppointments(data)

      if (!isEditing) {
        const newData: Record<string, any> = {}
        data.forEach((a: any) => {
          newData[a._id] = {
            labTest: a.labTest || '',
            prescription: a.prescription || '',
            diagnosis: a.diagnosis || '',
            doctorNote: a.doctorNote || '',
            followUp: a.followUp || '',
          }
        })
        setEdited(newData)
      }
    } catch {
      toast.error('Failed to load appointments')
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAppointments()
      const interval = setInterval(() => fetchAppointments(), 5000)
      return () => clearInterval(interval)
    }
  }, [status])

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/appointment/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      fetchAppointments()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleSave = async (id: string) => {
    try {
      await fetch(`/api/appointment/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edited[id]),
      })
      toast.success('Saved successfully')
      setIsEditing(false)
      fetchAppointments()
    } catch {
      toast.error('Save failed')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this appointment?')) return
    try {
      await fetch(`/api/appointment/${id}/status`, { method: 'DELETE' })
      fetchAppointments()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleChange = (id: string, field: string, value: string) => {
    setIsEditing(true)
    setEdited((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }))
  }

  const filtered = appointments
    .filter(
      (a) =>
        (filters.doctor === 'All' ||
          a.patient?.doctorType?.toLowerCase() ===
            filters.doctor.toLowerCase()) &&
        a.patient?.fullName
          ?.toLowerCase()
          .includes(filters.name.toLowerCase()) &&
        a.patient?.phone?.includes(filters.phone) &&
        a.patient?.reason?.toLowerCase().includes(filters.reason.toLowerCase())
    )
    .sort((a, b) => (a.status === 'done' ? 1 : -1))

  return (
    <div className='bg-blue-600 min-h-screen text-white font-sans p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Doctor's Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='bg-red-600 px-4 py-2 rounded-xl hover:bg-red-700'
        >
          Logout
        </button>
      </div>

      <div className='bg-white text-black rounded-xl overflow-x-auto'>
        <table className='w-full border border-gray-300'>
          <thead className='bg-gray-100 text-sm'>
            <tr>
              <th className='border p-2'>Queue</th>
              <th className='border p-2'>Name</th>
              <th className='border p-2'>Phone</th>
              <th className='border p-2'>Vitals</th>
              <th className='border p-2'>Doctor</th>
              <th className='border p-2'>Reason + Status</th>
              <th className='border p-2'>Lab Test</th>
              <th className='border p-2'>Prescription</th>
              <th className='border p-2'>Diagnosis</th>
              <th className='border p-2'>Doctor's Note</th>
              <th className='border p-2'>Follow-Up</th>
              <th className='border p-2'>Actions</th>
            </tr>
            <tr className='text-xs bg-blue-50'>
              <th></th>
              <th>
                <input
                  value={filters.name}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className='w-full p-1 border rounded'
                  placeholder='Search name'
                />
              </th>
              <th>
                <input
                  value={filters.phone}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className='w-full p-1 border rounded'
                  placeholder='Phone'
                />
              </th>
              <th></th>
              <th>
                <select
                  value={filters.doctor}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, doctor: e.target.value }))
                  }
                  className='w-full p-1 border rounded'
                >
                  {doctorTypes.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </th>
              <th>
                <input
                  value={filters.reason}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className='w-full p-1 border rounded'
                  placeholder='Reason'
                />
              </th>
              <th colSpan={6}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const isDone = a.status === 'done'
              return (
                <tr key={a._id} className='text-sm'>
                  <td className='border p-2'>{a.queueNumber || '-'}</td>
                  <td className='border p-2'>{a.patient?.fullName}</td>
                  <td className='border p-2'>{a.patient?.phone}</td>
                  <td className='border p-2 text-xs'>
                    <div>Temp: {a.temperature || '°C'}</div>
                    <div>BP: {a.bloodPressure || '-'}</div>
                    <div>Wt: {a.weight || 'kg'}</div>
                    <div>Ht: {a.height || 'cm'}</div>
                    {a.readyForDoctor && (
                      <div className='text-red-600 font-semibold mt-1'>
                        🔔 Ready for Review
                      </div>
                    )}
                  </td>
                  <td className='border p-2'>{a.patient?.doctorType}</td>
                  <td className='border p-2'>
                    <div>{a.patient?.reason}</div>
                    <select
                      disabled={isDone}
                      value={a.status}
                      onChange={(e) => updateStatus(a._id, e.target.value)}
                      className='w-full p-1 border rounded mt-1 text-sm'
                    >
                      <option value='waiting'>Waiting</option>
                      <option value='in-progress'>In Progress</option>
                      <option value='done'>Done</option>
                    </select>
                  </td>

                  {/* Editable Fields */}
                  {[
                    'labTest',
                    'prescription',
                    'diagnosis',
                    'doctorNote',
                    'followUp',
                  ].map((field) => (
                    <td key={field} className='border p-2'>
                      {field === 'followUp' ? (
                        <input
                          type='date'
                          disabled={isDone}
                          className={`w-full p-1 border rounded text-sm ${
                            isDone ? 'bg-gray-100 text-gray-500' : ''
                          }`}
                          value={
                            edited[a._id]?.[field]
                              ? edited[a._id][field].split('T')[0]
                              : ''
                          }
                          onChange={(e) =>
                            handleChange(a._id, field, e.target.value)
                          }
                        />
                      ) : (
                        <textarea
                          disabled={isDone}
                          className={`w-full p-1 border rounded resize-none text-sm ${
                            isDone ? 'bg-gray-100 text-gray-500' : ''
                          }`}
                          rows={2}
                          value={edited[a._id]?.[field] || ''}
                          onChange={(e) =>
                            handleChange(a._id, field, e.target.value)
                          }
                        />
                      )}
                    </td>
                  ))}

                  {/* Actions */}
                  <td className='border p-2 flex gap-2'>
                    <button
                      onClick={() => handleSave(a._id)}
                      disabled={isDone}
                      className='bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50'
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleDelete(a._id)}
                      className='bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={12}
                  className='text-center text-gray-500 p-4 border'
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
