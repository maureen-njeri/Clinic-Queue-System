import Image from 'next/image'

export default function ClinicLogo() {
  return (
    <div className='flex flex-col items-center space-y-4 p-4 sm:p-6 text-center'>
      {/* Logo */}
      <Image
        src='/first-response-logo.png'
        alt='First Response Clinic Logo'
        width={120}
        height={120}
        priority
        className='rounded-full shadow-md'
      />

      {/* Welcome Text */}
      <h1 className='text-blue-700 dark:text-blue-400 text-2xl sm:text-3xl font-bold'>
        Welcome to First Response Clinic
      </h1>

      {/* Clinic Highlights */}
      <ul className='text-blue-600 dark:text-blue-300 text-sm sm:text-base space-y-2'>
        <li>✔ 24/7 Emergency Care</li>
        <li>✔ Expert Medical Staff</li>
        <li>✔ Patient-Centered Approach</li>
        <li>✔ Real-Time Queue Management</li>
        <li>✔ Confidential & Compassionate Service</li>
      </ul>
    </div>
  )
}
