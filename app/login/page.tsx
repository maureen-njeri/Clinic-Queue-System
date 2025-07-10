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

  if (status === 'loading') {
    return (
      <div className='min-h-screen flex items-center justify-center text-xl font-semibold'>
        Loading...
      </div>
    )
  }

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
    <div className='min-h-screen flex flex-col lg:flex-row font-sans'>
      {/* Left: Logo + Slogan */}
      <div className='lg:w-1/2 bg-[#004990] text-white flex flex-col justify-center items-center px-10 py-8'>
        <div className='text-center'>
          <img
            src='/first-response-logo.png'
            alt='Clinic Logo'
            className='w-40 h-40 object-contain mb-3'
          />
          <p className='text-sm sm:text-base font-medium tracking-wider'>
            QUALITY • COMPASSION • INTEGRITY
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className='lg:w-1/2 bg-[#004990] flex items-center justify-center p-6 sm:p-12'>
        <div className='bg-white rounded-2xl shadow-2xl w-full max-w-xl p-10 sm:p-12'>
          <h2 className='text-4xl font-extrabold text-center mb-8 text-[#004990]'>
            Sign In
          </h2>

          {error && (
            <p className='mb-4 text-center text-red-600 font-medium'>{error}</p>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-lg font-semibold mb-2'>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className='w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              >
                <option value='Admin'>Admin</option>
                <option value='Doctor'>Doctor</option>
                <option value='Nurse'>Nurse</option>
                <option value='Pharmacist'>Pharmacist</option>
                <option value='Receptionist'>Receptionist</option>
                <option value='Lab Technician'>Lab Technician</option>
              </select>
            </div>

            <div>
              <label className='block text-lg font-semibold mb-2'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>

            <div>
              <label className='block text-lg font-semibold mb-2'>
                Password
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className='w-full px-6 py-4 text-lg border border-gray-300 rounded-full pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute inset-y-0 right-4 flex items-center justify-center text-gray-500'
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

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
              className='w-full py-4 bg-[#004990] text-white text-lg font-bold rounded-full hover:bg-blue-800 transition'
            >
              Sign In
            </button>

            <p className='text-center text-sm mt-4'>
              Don't have an account?{' '}
              <a
                href='/signup'
                className='text-blue-600 font-semibold hover:underline'
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
