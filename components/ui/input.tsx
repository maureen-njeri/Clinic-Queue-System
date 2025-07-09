// components/ui/input.tsx
import React from 'react'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`border border-gray-300 rounded px-3 py-2 text-sm w-full ${className}`}
      {...props}
    />
  )
})

Input.displayName = 'Input'
