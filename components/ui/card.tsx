// components/ui/card.tsx
import { cn } from '@/lib/utils' // or whatever your classnames helper is

export function Card({ children }: { children: React.ReactNode }) {
  return <div className='rounded-xl shadow bg-white'>{children}</div>
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('p-4', className)}>{children}</div>
}
