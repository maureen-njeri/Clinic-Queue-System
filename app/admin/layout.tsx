// app/admin/layout.tsx

import { Toaster } from 'react-hot-toast'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-blue-600 flex items-center justify-center px-4'>
      <div className='w-full max-w-md p-8 rounded-2xl shadow-xl bg-white'>
        {children}
      </div>
      <Toaster position='top-right' reverseOrder={false} />
    </div>
  )
}
