// components/ui/button.tsx
import React from 'react'

export const Button = ({
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
