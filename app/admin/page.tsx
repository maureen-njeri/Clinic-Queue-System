'use client'

import React, { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { pusherClient } from '@/lib/pusher-client'

type Booking = {
  _id: string
  status: 'waiting' | 'in-progress' | 'done'
  patient: {
    fullName: string
    email: string
    phone: string
    reason: string
    doctorType: string
  }
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [sortStatus, setSortStatus] = useState('')
  const [doctorFilter, setDoctorFilter] = useState('')

  // Role-based access control (only admin, nurse, pharmacist)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    } else if (
      status === 'authenticated' &&
      !['admin', 'nurse', 'pharmacist'].includes(session?.user?.role || '')
    ) {
      alert('Access denied: Unauthorized role')
      signOut()
      router.push('/')
    }
  }, [status, session, router])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings', { cache: 'no-store' })
      const data = await res.json()
      setBookings(data.data || [])
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
      fetchBookings()
    } catch (err) {
      console.error('Failed to delete booking:', err)
    }
  }

  const updateBookingStatus = async (
    id: string,
    newStatus: Booking['status']
  ) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchBookings()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  useEffect(() => {
    fetchBookings()

    const channel = pusherClient.subscribe('bookings')
    channel.bind('new-booking', fetchBookings)
    channel.bind('status-updated', fetchBookings)

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let result = [...bookings]
    if (searchName) {
      result = result.filter((b) =>
        b.patient?.fullName?.toLowerCase().includes(searchName.toLowerCase())
      )
    }
    if (searchEmail) {
      result = result.filter((b) =>
        b.patient?.email?.toLowerCase().includes(searchEmail.toLowerCase())
      )
    }
    if (sortStatus) {
      result = result.filter((b) => b.status === sortStatus)
    }
    if (doctorFilter) {
      result = result.filter((b) => b.patient?.doctorType === doctorFilter)
    }
    setFilteredBookings(result)
  }, [searchName, searchEmail, sortStatus, doctorFilter, bookings])

  const statusCounts = {
    waiting: bookings.filter((b) => b.status === 'waiting').length,
    inProgress: bookings.filter((b) => b.status === 'in-progress').length,
    done: bookings.filter((b) => b.status === 'done').length,
    total: bookings.length,
  }

  return (
    <div className='min-h-screen bg-accent p-8 font-sans text-gray-800'>
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-primary'>
          Admin Dashboard - Welcome, {session?.user?.name}
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className='px-4 py-2 bg-primary rounded-xl text-white hover:bg-primary-dark'
        >
          Sign Out
        </button>
      </header>

      <section className='mb-6 flex flex-wrap gap-4'>
        <input
          type='text'
          placeholder='Search by name'
          className='rounded-xl px-4 py-2 border border-primary focus:outline-none focus:ring-2 focus:ring-primary'
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type='text'
          placeholder='Search by email'
          className='rounded-xl px-4 py-2 border border-primary focus:outline-none focus:ring-2 focus:ring-primary'
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <select
          className='rounded-xl px-4 py-2 border border-primary focus:outline-none focus:ring-2 focus:ring-primary'
          value={sortStatus}
          onChange={(e) => setSortStatus(e.target.value)}
        >
          <option value=''>All Statuses</option>
          <option value='waiting'>Waiting</option>
          <option value='in-progress'>In-Progress</option>
          <option value='done'>Done</option>
        </select>
        <select
          className='rounded-xl px-4 py-2 border border-primary focus:outline-none focus:ring-2 focus:ring-primary'
          value={doctorFilter}
          onChange={(e) => setDoctorFilter(e.target.value)}
        >
          <option value=''>All Doctors</option>
          <option value='Physician'>Physician</option>
          <option value='Surgeon'>Surgeon</option>
          <option value='Dentist'>Dentist</option>
        </select>
      </section>

      <section className='mb-6'>
        <p className='text-lg font-semibold'>
          Total: {statusCounts.total} | Waiting: {statusCounts.waiting} |
          In-Progress: {statusCounts.inProgress} | Done: {statusCounts.done}
        </p>
      </section>

      <section>
        {filteredBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className='space-y-4'>
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className='p-4 bg-white rounded-xl shadow-md flex flex-col space-y-2'
              >
                <p>
                  <strong>Name:</strong> {booking.patient.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {booking.patient.email}
                </p>
                <p>
                  <strong>Phone:</strong> {booking.patient.phone}
                </p>
                <p>
                  <strong>Reason:</strong> {booking.patient.reason}
                </p>
                <p>
                  <strong>Doctor:</strong> {booking.patient.doctorType}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <select
                    className='rounded-xl border border-primary px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
                    value={booking.status}
                    onChange={(e) =>
                      updateBookingStatus(
                        booking._id,
                        e.target.value as Booking['status']
                      )
                    }
                  >
                    <option value='waiting'>Waiting</option>
                    <option value='in-progress'>In-Progress</option>
                    <option value='done'>Done</option>
                  </select>
                </p>
                <button
                  onClick={() => deleteBooking(booking._id)}
                  className='mt-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark'
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
