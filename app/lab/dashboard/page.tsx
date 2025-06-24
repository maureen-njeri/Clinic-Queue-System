'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface LabTest {
  _id?: string
  patientName: string
  testType: string
  result?: string
  status: 'pending' | 'completed'
  fileUrl?: string
}

export default function LabDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tests, setTests] = useState<LabTest[]>([])
  const [form, setForm] = useState<Partial<LabTest>>({})
  const [file, setFile] = useState<File | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (
      status === 'authenticated' &&
      session?.user?.role?.toLowerCase() !== 'lab technician'
    ) {
      alert('Access denied: Lab technicians only')
      signOut({ callbackUrl: '/login' })
    }
  }, [status, session, router])

  const fetchTests = async () => {
    const res = await fetch('/api/labtests')
    const data = await res.json()
    setTests(data)
  }

  const handleCreate = async () => {
    if (!form.patientName || !form.testType) {
      return alert('Please fill all fields')
    }

    const body = new FormData()
    body.append('patientName', form.patientName)
    body.append('testType', form.testType)
    if (file) body.append('file', file)

    await fetch('/api/labtests', {
      method: 'POST',
      body,
    })

    setForm({})
    setFile(null)
    toast.success('✅ Lab test added!')
    fetchTests()
  }

  const updateResult = async (id: string, result: string) => {
    await fetch(`/api/labtests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result, status: 'completed' }),
    })
    toast.success('Result updated and doctor notified!')
    fetchTests()
  }

  useEffect(() => {
    fetchTests()
  }, [])

  const filteredTests =
    filter === 'all' ? tests : tests.filter((t) => t.status === filter)

  return (
    <div className='p-8 min-h-screen bg-blue-600 text-white'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Lab Technician Dashboard</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700'
        >
          Log Out
        </button>
      </div>

      <main className='bg-white p-6 rounded-xl shadow-md text-black space-y-6'>
        <h2 className='text-xl font-semibold'>
          Welcome, {session?.user?.fullName || 'Lab Technician'}
        </h2>

        {/* Add Lab Test Form */}
        <div className='space-y-4'>
          <h3 className='text-lg font-bold'>Add New Lab Test</h3>
          <input
            className='px-4 py-2 border rounded-xl w-full'
            placeholder='Patient Name'
            value={form.patientName || ''}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
          />
          <input
            className='px-4 py-2 border rounded-xl w-full'
            placeholder='Test Type'
            value={form.testType || ''}
            onChange={(e) => setForm({ ...form, testType: e.target.value })}
          />
          <input
            type='file'
            className='w-full'
            accept='.pdf,.jpg,.jpeg,.png'
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            onClick={handleCreate}
            className='bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700'
          >
            Create Test
          </button>
        </div>

        {/* Filters */}
        <div className='space-x-2 text-sm'>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'all' ? 'bg-blue-700 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'pending' ? 'bg-blue-700 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`px-3 py-1 rounded ${
              filter === 'completed' ? 'bg-blue-700 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Display Lab Tests */}
        <div>
          <h3 className='text-lg font-bold mb-2'>Lab Tests</h3>
          {filteredTests.length === 0 ? (
            <p>No lab tests found.</p>
          ) : (
            <table className='w-full text-left border text-sm'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='p-2 border'>Patient</th>
                  <th className='p-2 border'>Test Type</th>
                  <th className='p-2 border'>Status</th>
                  <th className='p-2 border'>Result</th>
                  <th className='p-2 border'>File</th>
                  <th className='p-2 border'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test) => (
                  <tr key={test._id} className='border-t'>
                    <td className='p-2 border'>{test.patientName}</td>
                    <td className='p-2 border'>{test.testType}</td>
                    <td className='p-2 border capitalize'>{test.status}</td>
                    <td className='p-2 border'>
                      {test.status === 'completed' ? (
                        test.result
                      ) : (
                        <input
                          className='border rounded px-2 py-1 w-full'
                          placeholder='Enter result'
                          onBlur={(e) =>
                            updateResult(test._id!, e.target.value)
                          }
                        />
                      )}
                    </td>
                    <td className='p-2 border'>
                      {test.fileUrl ? (
                        <a
                          href={test.fileUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 underline'
                        >
                          View File
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className='p-2 border'>
                      {test.status === 'completed' ? '✔️' : '⏳'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
