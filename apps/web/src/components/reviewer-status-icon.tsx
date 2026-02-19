import { Check, Clock, Minus } from 'lucide-react'

import { cn } from '@/lib/utils'

type ReviewerStatus = 'approved' | 'changes_requested' | 'rejected' | 'pending' | 'approved_with_suggestions'

interface ReviewerStatusIconProps {
  status: ReviewerStatus
  className?: string
  iconSize?: string
}

export function ReviewerStatusIcon({ status, className, iconSize = 'size-3' }: ReviewerStatusIconProps) {
  if (status === 'approved' || status === 'approved_with_suggestions') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-2 border-green-500 bg-background dark:border-green-600',
          className
        )}
      >
        <Check className={cn(iconSize, 'text-green-500 dark:text-green-600')} strokeWidth={3} />
      </div>
    )
  }

  if (status === 'changes_requested' || status === 'rejected') {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full border-2 bg-background',
          status === 'rejected' ? 'border-red-500 dark:border-red-600' : 'border-amber-500 dark:border-amber-600',
          className
        )}
      >
        <Minus
          className={cn(
            iconSize,
            status === 'rejected' ? 'text-red-500 dark:text-red-600' : 'text-amber-500 dark:text-amber-600'
          )}
          strokeWidth={2.5}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full border-2 border-gray-400 bg-background dark:border-gray-600',
        className
      )}
    >
      <Clock className={cn(iconSize, 'text-gray-400 dark:text-gray-600')} strokeWidth={2.5} />
    </div>
  )
}
