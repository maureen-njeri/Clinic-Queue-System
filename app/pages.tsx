import ClinicLogo from '@/components/ClinicLogo'

export default function HomePage() {
  return (
    <main className='min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4'>
      <div className='w-full max-w-md md:max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-10 rounded-2xl shadow-lg'>
        <ClinicLogo />
      </div>
    </main>
  )
}
