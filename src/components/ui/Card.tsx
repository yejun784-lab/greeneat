import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('bg-surface rounded-2xl border border-gray-100 shadow-sm', className)}>
      {children}
    </div>
  )
}
