export default function Header(): JSX.Element {
  return (
    <header className='flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-[var(--background)]'>
      <img
        src='/first-response-logo.png'
        alt='Clinic Logo'
        className='w-12 h-12 mr-3'
      />
      <h1 className='text-xl font-semibold text-[var(--foreground)]'>
        Clinic Name
      </h1>
    </header>
  )
}
