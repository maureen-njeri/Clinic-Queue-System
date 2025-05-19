'use client'

import { useState } from 'react'

interface QueueStatus {
  currentQueue: number
  yourQueue: number | null
  error?: string
}

export default function QueueStatusPage() {
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<QueueStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    const res = await fetch(`/api/queue/${phone}`)
    const data = await res.json()
    setStatus(data)
    setLoading(false)
  }

  return (
    <div className='p-6 max-w-xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Check Queue Status</h1>

      <input
        type='tel'
        placeholder='Enter Phone Number'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className='w-full p-2 border rounded mb-4'
      />

      <button
        onClick={checkStatus}
        disabled={loading}
        className='bg-green-600 text-white px-4 py-2 rounded'
      >
        {loading ? 'Checking...' : 'Check Status'}
      </button>

      {status && !status.error && (
        <div className='mt-4 bg-blue-100 p-4 rounded'>
          <p>
            Current Number: <strong>{status.currentQueue}</strong>
          </p>
          <p>
            Your Number: <strong>{status.yourQueue ?? 'N/A'}</strong>
          </p>
          <p>
            People Ahead:{' '}
            <strong>
              {status.yourQueue === null
                ? 'N/A'
                : Math.max(status.yourQueue - status.currentQueue, 0)}
            </strong>
          </p>
        </div>
      )}

      {status?.error && (
        <div className='mt-4 bg-red-100 p-4 rounded'>
          <p>{status.error}</p>
        </div>
      )}
    </div>
  )
}
