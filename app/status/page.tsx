'use client'

import { useState } from 'react'

export default function CheckStatus() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('')
    setError('')

    try {
      const res = await fetch(
        `/api/status?name=${encodeURIComponent(
          fullName
        )}&phone=${encodeURIComponent(phone)}`
      )
      const data = await res.json()

      if (res.ok) {
        setStatus(
          `✅ Your queue number is ${data.data.queueNumber}. Status: ${data.data.status}`
        )
      } else {
        setError(data.error || 'Could not find your record.')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <main
      style={{
        maxWidth: 400,
        margin: '3rem auto',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: 8,
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#0070f3',
        }}
      >
        Check Your Queue Status
      </h1>
      <form
        onSubmit={handleCheck}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <label style={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Full Name
          <input
            type='text'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder='Your full name'
            style={{
              marginTop: 4,
              padding: '8px',
              fontSize: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </label>

        <label style={{ fontWeight: 700, fontSize: '1.05rem' }}>
          Phone Number
          <input
            type='text'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            required
            placeholder='e.g. 0712345678'
            style={{
              marginTop: 4,
              padding: '8px',
              fontSize: '1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
        </label>

        <button
          type='submit'
          style={{
            marginTop: '1rem',
            padding: '10px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          Check Status
        </button>
      </form>

      {status && (
        <p
          style={{
            marginTop: '1.5rem',
            color: 'green',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {status}
        </p>
      )}
      {error && (
        <p
          style={{
            marginTop: '1.5rem',
            color: 'red',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {error}
        </p>
      )}
    </main>
  )
}
