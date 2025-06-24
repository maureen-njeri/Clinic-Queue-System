import Image from 'next/image'

export default function ClinicLogo() {
  return (
    <div className='flex flex-col items-center space-y-3 p-6'>
      {/* Logo image */}
      <Image
        src='/first-response-logo.png' // Update to match your new logo filename
        alt='First Response Clinic Logo'
        width={160}
        height={160}
        priority
        className='rounded-full shadow-lg'
      />

      {/* Welcome Message */}
      <h1 className='text-blue-700 dark:text-blue-400 text-3xl font-extrabold text-center'>
        Welcome to First Response Clinic
      </h1>

      {/* Clinic Unique Value Statements */}
      <ul className='text-blue-600 dark:text-blue-300 text-base text-center space-y-1'>
        <li>✔ 24/7 Emergency Care</li>
        <li>✔ Expert Medical Staff</li>
        <li>✔ Patient-Centered Approach</li>
        <li>✔ Real-Time Queue Management</li>
        <li>✔ Confidential and Compassionate Service</li>
      </ul>
    </div>
  )
}
