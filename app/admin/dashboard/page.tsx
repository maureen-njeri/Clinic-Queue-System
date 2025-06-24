'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type User = {
  _id: string
  fullName: string
  email: string
  role: string
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchName, setSearchName] = useState('')
  const [searchEmail, setSearchEmail] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  const roles = [
    'admin',
    'doctor',
    'nurse',
    'pharmacist',
    'lab technician',
    'receptionist',
  ]

  // Protect route
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'Admin') {
      alert('Access denied: Admins only')
      signOut({ callbackUrl: '/login' })
    }
  }, [status, session])

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data || [])
    } catch (err) {
      console.error('Failed to fetch users:', err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = [...users]
    if (searchName) {
      filtered = filtered.filter((u) =>
        u.fullName.toLowerCase().includes(searchName.toLowerCase())
      )
    }
    if (searchEmail) {
      filtered = filtered.filter((u) =>
        u.email.toLowerCase().includes(searchEmail.toLowerCase())
      )
    }
    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter)
    }
    setFilteredUsers(filtered)
  }, [searchName, searchEmail, roleFilter, users])

  const updateUserRole = async (id: string, newRole: string) => {
    try {
      await fetch(`/api/users/${id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      fetchUsers()
    } catch (err) {
      console.error('Failed to update role:', err)
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      fetchUsers()
    } catch (err) {
      console.error('Failed to delete user:', err)
    }
  }

  const roleCounts = roles.reduce((acc, role) => {
    acc[role] = users.filter((u) => u.role === role).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className='min-h-screen bg-accent p-8 font-sans text-gray-800'>
      {/* Header */}
      <header className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-primary'>
          Admin Dashboard - User Management
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700'
        >
          Logout
        </button>
      </header>

      {/* Filters */}
      <section className='mb-6 space-y-2'>
        <div className='flex flex-wrap gap-4'>
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value=''>All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <p className='text-md font-semibold'>
          Total Users: {users.length} |{' '}
          {roles.map((r) => (
            <span key={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}: {roleCounts[r] || 0} |{' '}
            </span>
          ))}
        </p>
      </section>

      {/* User List */}
      <section>
        {filteredUsers.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <div className='space-y-4'>
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className='p-4 bg-white rounded-xl shadow-md flex flex-col space-y-2'
              >
                <p>
                  <strong>Name:</strong> {user.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong>{' '}
                  <select
                    className='border px-2 py-1 rounded'
                    value={user.role}
                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </p>
                <button
                  onClick={() => deleteUser(user._id)}
                  className='mt-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700'
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
