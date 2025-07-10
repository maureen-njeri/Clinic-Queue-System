'use client'

import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [role, setRole] = useState('Admin')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const roleRoutes: Record<string, string> = {
    admin: '/admin/dashboard',
    doctor: '/doctor/dashboard',
    nurse: '/nurse/dashboard',
    pharmacist: '/pharmacist/dashboard',
    receptionist: '/receptionist/dashboard',
    'lab technician': '/lab/dashboard',
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role) {
      const userRole = session.user.role.toLowerCase()
      router.push(roleRoutes[userRole] || '/admin/dashboard')
    }
  }, [status, session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      role,
    })

    if (res?.error) {
      setError(res.error)
    } else if (res?.ok) {
      const sessionRes = await fetch('/api/auth/session')
      const sessionData = await sessionRes.json()
      const userRole = sessionData?.user?.role?.toLowerCase()
      router.push(roleRoutes[userRole] || '/admin/dashboard')
    }
  }

  return (
    <div className='w-screen h-screen flex flex-row items-center justify-center bg-black text-white overflow-hidden'>
      {/* Left - Logo */}
      <div className='w-1/2 min-w-[180px] max-w-sm flex flex-col items-center justify-center p-4'>
        <img
          src='/first-response-logo.png'
          alt='Logo'
          className='w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full mb-4 object-contain'
        />
        <p className='text-sm text-gray-300 text-center'>
          QUALITY • COMPASSION • INTEGRITY
        </p>
      </div>

      {/* RIGHT - FORM SECTION */}
      <div className='w-1/2 min-w-[240px] flex justify-center items-center p-4'>
        <div className='w-full max-w-md bg-white text-black rounded-2xl shadow-xl p-8'>
          <h2 className='text-2xl font-bold text-center mb-6 text-[#004990]'>
            Sign In
          </h2>

          {error && (
            <p className='text-red-600 text-center font-medium mb-4'>{error}</p>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Role */}
            <div>
              <label className='text-sm font-semibold block mb-1'>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              >
                <option>Admin</option>
                <option>Doctor</option>
                <option>Nurse</option>
                <option>Pharmacist</option>
                <option>Receptionist</option>
                <option>Lab Technician</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className='text-sm font-semibold block mb-1'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>

            {/* Password */}
            <div>
              <label className='text-sm font-semibold block mb-1'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full px-4 py-3 border border-gray-300 rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-4 flex items-center text-gray-500'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className='flex items-center justify-between text-sm'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='mr-2'
                />
                Remember me
              </label>
              <a href='#' className='text-blue-600 hover:underline'>
                Forgot password?
              </a>
            </div>

            <button
              type='submit'
              className='w-full py-3 bg-[#004990] text-white font-semibold rounded-full hover:bg-blue-800 transition'
            >
              Sign In
            </button>

            <p className='text-center text-sm text-gray-600 mt-3'>
              Don’t have an account?{' '}
              <a
                href='/register'
                className='text-blue-600 hover:underline font-semibold'
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
