'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

export default function PharmacistDashboard() {
  const { status } = useSession()
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'dispensed'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchPrescriptions()
    }
  }, [status])

  const fetchPrescriptions = async () => {
    try {
      const res = await fetch('/api/appointment')
      const data = await res.json()
      setAppointments(data)
    } catch {
      toast.error('Failed to load prescriptions')
    }
  }

  const handleDispense = async (id: string, note: string) => {
    try {
      const res = await fetch(`/api/appointment/${id}/dispense`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispensed: true, pharmacistNote: note }),
      })
      if (!res.ok) throw new Error()
      toast.success('Medicine marked as dispensed')
      fetchPrescriptions()
    } catch {
      toast.error('Failed to update prescription')
    }
  }

  const handlePrint = async (a: any) => {
    const doc = new jsPDF()
    const logoUrl = '/logo.png'
    const img = new Image()
    img.src = logoUrl
    await new Promise((res) => (img.onload = res))
    doc.addImage(img, 'PNG', 20, 10, 40, 15)

    doc.setFontSize(14)
    doc.text('Prescription Summary', 70, 20)

    let y = 40
    doc.setFontSize(12)
    doc.text(`Patient: ${a.patient?.fullName}`, 20, y)
    y += 10
    doc.text(`Doctor: ${a.patient?.doctorType}`, 20, y)
    y += 10
    doc.text(`Prescription: ${a.prescription}`, 20, y)
    y += 10
    doc.text(`Status: ${a.status}`, 20, y)
    y += 10
    doc.text(`Pharmacist Note: ${a.pharmacistNote || 'N/A'}`, 20, y)
    y += 10
    doc.text(`Dispensed: ${a.dispensed ? 'Yes' : 'No'}`, 20, y)

    const blob = doc.output('blob')
    const url = URL.createObjectURL(blob)
    const win = window.open(url)
    if (win) {
      win.onload = () => win.print()
    }
  }

  const handleDownloadAll = async () => {
    const doc = new jsPDF()
    const logoUrl = '/logo.png'
    const img = new Image()
    img.src = logoUrl
    await new Promise((res) => (img.onload = res))

    let y = 20

    for (let i = 0; i < appointments.length; i++) {
      const a = appointments[i]
      if (!a.prescription) continue

      if (y > 250) {
        doc.addPage()
        y = 20
      }

      doc.addImage(img, 'PNG', 20, y, 40, 15)
      doc.setFontSize(14)
      doc.text('Prescription Summary', 70, y + 10)

      y += 30
      doc.setFontSize(12)
      doc.text(`#${i + 1}`, 20, y)
      y += 10
      doc.text(`Patient: ${a.patient?.fullName}`, 20, y)
      y += 10
      doc.text(`Doctor: ${a.patient?.doctorType}`, 20, y)
      y += 10
      doc.text(`Prescription: ${a.prescription}`, 20, y)
      y += 10
      doc.text(`Status: ${a.status}`, 20, y)
      y += 10
      doc.text(`Pharmacist Note: ${a.pharmacistNote || 'N/A'}`, 20, y)
      y += 20
    }

    doc.save('All_Prescriptions.pdf')
  }

  const filtered = appointments.filter((a) => {
    if (!a.prescription) return false
    if (filter === 'pending' && a.dispensed) return false
    if (filter === 'dispensed' && !a.dispensed) return false
    if (
      search &&
      !a.patient?.fullName?.toLowerCase().includes(search.toLowerCase()) &&
      !a.patient?.doctorType?.toLowerCase().includes(search.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className='min-h-screen bg-accent text-primary p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Pharmacist Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
        >
          Logout
        </button>
      </div>

      <div className='mb-4 flex flex-wrap gap-4'>
        <input
          type='text'
          placeholder='Search patient or doctor'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='px-3 py-2 rounded border w-64'
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className='px-3 py-2 rounded border'
        >
          <option value='all'>All</option>
          <option value='pending'>Pending Only</option>
          <option value='dispensed'>Dispensed Only</option>
        </select>
        <button
          onClick={handleDownloadAll}
          className='bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800'
        >
          Download All
        </button>
      </div>

      <ul className='space-y-4'>
        {filtered.map((a) => (
          <li key={a._id} className='bg-white p-4 shadow rounded'>
            <p>
              <strong>Patient:</strong> {a.patient?.fullName}
            </p>
            <p>
              <strong>Doctor:</strong> {a.patient?.doctorType}
            </p>
            <p>
              <strong>Prescription:</strong> {a.prescription}
            </p>
            <p>
              <strong>Status:</strong> {a.status}
            </p>
            <p>
              <strong>Dispensed:</strong> {a.dispensed ? 'Yes' : 'No'}
            </p>
            <p>
              <strong>Pharmacist Note:</strong> {a.pharmacistNote || 'None'}
            </p>

            <div className='flex gap-2 mt-3 flex-wrap'>
              {!a.dispensed && (
                <>
                  <input
                    type='text'
                    placeholder='Pharmacist note'
                    onChange={(e) => (a._note = e.target.value)}
                    className='border px-2 py-1 rounded w-64'
                  />
                  <button
                    onClick={() => handleDispense(a._id, a._note || '')}
                    className='bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700'
                  >
                    Mark as Dispensed
                  </button>
                </>
              )}
              <button
                onClick={() => handlePrint(a)}
                className='bg-gray-700 text-white px-4 py-1 rounded hover:bg-gray-800'
              >
                Print
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
