'use client'

import { useState } from 'react'

export default function BookPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('')
  const [doctorType, setDoctorType] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    setErrors({})

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName,
        email,
        phone,
        reason,
        doctorType,
      }),
    })

    const result = await response.json()

    if (response.ok) {
      setMessage(`🎉 Booked! Your queue number is ${result.data.queueNumber}`)
      // Clear form fields
      setFullName('')
      setEmail('')
      setPhone('')
      setReason('')
      setDoctorType('')
      setErrors({})
    } else {
      if (result.errors) {
        const fieldErrors: { [key: string]: string } = {}
        result.errors.forEach((err: any) => {
          fieldErrors[err.field] = err.message
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: result.error || 'Something went wrong' })
      }
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
        Book Your Queue Slot
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        noValidate // disable browser native validation
      >
        <label style={{ fontWeight: 'bold' }}>
          Full Name
          <input
            type='text'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder='Your full name'
            style={inputStyle}
          />
          {errors.fullName && (
            <p style={{ color: 'red', marginTop: 4 }}>{errors.fullName}</p>
          )}
        </label>

        <label style={{ fontWeight: 'bold' }}>
          Email
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='you@example.com'
            style={inputStyle}
          />
          {errors.email && (
            <p style={{ color: 'red', marginTop: 4 }}>{errors.email}</p>
          )}
        </label>

        <label style={{ fontWeight: 'bold' }}>
          Phone Number
          <input
            type='text'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
            placeholder='e.g. 0712345678'
            style={inputStyle}
          />
          {errors.phone && (
            <p style={{ color: 'red', marginTop: 4 }}>{errors.phone}</p>
          )}
        </label>

        <label style={{ fontWeight: 'bold' }}>
          Reason for Visit
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={inputStyle}
          >
            <option value=''>-- Select Reason --</option>
            <option value='Emergency'>Emergency</option>
            <option value='Consultation'>Consultation</option>
            <option value='Follow-up'>Follow-up</option>
            <option value='Routine Check-up'>Routine Check-up</option>
          </select>
          {errors.reason && (
            <p style={{ color: 'red', marginTop: 4 }}>{errors.reason}</p>
          )}
        </label>

        <label style={{ fontWeight: 'bold' }}>
          Doctor
          <select
            value={doctorType}
            onChange={(e) => setDoctorType(e.target.value)}
            style={inputStyle}
          >
            <option value=''>-- Select Doctor --</option>
            <option value='General Physician'>General Physician</option>
            <option value='Gynecologist'>Gynecologist</option>
            <option value='Surgeon'>Surgeon</option>
            <option value='Pediatrician'>Pediatrician</option>
            <option value='Dentist'>Dentist</option>
            <option value='Cardiologist'>Cardiologist</option>
            <option value='Neurologist'>Neurologist</option>
          </select>
          {errors.doctorType && (
            <p style={{ color: 'red', marginTop: 4 }}>{errors.doctorType}</p>
          )}
        </label>

        <button type='submit' style={buttonStyle}>
          Book Now
        </button>
      </form>

      {/* General errors */}
      {errors.general && (
        <p
          style={{
            marginTop: '1.5rem',
            color: 'red',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {errors.general}
        </p>
      )}

      {/* Success message */}
      {message && (
        <p
          style={{
            marginTop: '1.5rem',
            color: 'green',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {message}
        </p>
      )}
    </main>
  )
}

const inputStyle = {
  marginTop: 4,
  padding: '8px',
  fontSize: '1rem',
  borderRadius: 4,
  border: '1px solid #ccc',
  width: '100%',
}

const buttonStyle = {
  marginTop: '1rem',
  padding: '10px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1.1rem',
}
