interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-skeleton bg-tint rounded-lg ${className}`} />
  )
}