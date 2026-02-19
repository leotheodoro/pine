import { ReviewerStatusIcon } from '@/components/reviewer-status-icon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Reviewer = {
  name: string
  email?: string
  avatarUrl?: string
  status: 'approved' | 'changes_requested' | 'rejected' | 'pending' | 'approved_with_suggestions'
}

type ProfileUser = {
  name: string
  email?: string | null
  bitbucket_email?: string | null
}

interface ReviewerAvatarsProps {
  reviewers: Reviewer[]
  currentUser: ProfileUser
}

function isCurrentUserReviewer(reviewer: { name: string; email?: string }, profileUser: ProfileUser): boolean {
  if (reviewer.email && (reviewer.email === profileUser.email || reviewer.email === profileUser.bitbucket_email)) {
    return true
  }
  return reviewer.name === profileUser.name
}

function getStatusLabel(status: Reviewer['status']): string {
  switch (status) {
    case 'approved':
      return 'Approved'
    case 'approved_with_suggestions':
      return 'Approved with suggestions'
    case 'changes_requested':
      return 'Requested changes'
    case 'rejected':
      return 'Rejected'
    case 'pending':
      return 'Pending'
    default:
      return 'Unknown'
  }
}

export function ReviewerAvatars({ reviewers, currentUser }: ReviewerAvatarsProps) {
  const activeReviewers = reviewers.filter((reviewer) => {
    if (reviewer.status === 'pending') return false
    if (isCurrentUserReviewer(reviewer, currentUser)) return false
    return true
  })

  if (activeReviewers.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-1.5 pt-2">
      <span className="text-xs font-medium text-muted-foreground">Other Reviewers:</span>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {activeReviewers.map((reviewer, index) => (
            <Tooltip key={`${reviewer.name}-${index}`} delayDuration={300}>
              <TooltipTrigger asChild>
                <div className="relative cursor-help">
                  <Avatar size="sm" className="ring-1 ring-border">
                    <AvatarImage src={reviewer.avatarUrl} alt={reviewer.name} />
                    <AvatarFallback className="text-xs">{reviewer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5">
                    <ReviewerStatusIcon status={reviewer.status} className="size-4 ring-2 ring-background" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="font-medium">{reviewer.name}</p>
                <p className="text-xs text-muted-foreground">{getStatusLabel(reviewer.status)}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
