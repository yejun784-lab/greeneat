import { cn } from '@/lib/utils'

type BadgeVariant = 'green' | 'orange' | 'gray' | 'blue'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-green-tint text-[#2d7a4f]',
  orange: 'bg-orange-50 text-orange-600',
  gray: 'bg-tint text-ink-3',
  blue: 'bg-blue-50 text-blue-600',
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
