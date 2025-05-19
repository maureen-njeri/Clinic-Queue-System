import Link from 'next/link'

export default function Home() {
  return (
    <main className='p-6 max-w-xl mx-auto text-center'>
      <h1 className='text-3xl font-bold mb-6'>Clinic Queue System</h1>
      <Link
        href='/book'
        className='block bg-blue-600 text-white p-4 rounded mb-4'
      >
        Book Appointment
      </Link>
      <Link
        href='/status'
        className='block bg-green-600 text-white p-4 rounded'
      >
        Check Queue Status
      </Link>
    </main>
  )
}
