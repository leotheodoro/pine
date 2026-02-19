import { ReviewerStatusIcon } from '@/components/reviewer-status-icon'

type Reviewer = {
  name: string
  email?: string
  status: 'approved' | 'changes_requested' | 'rejected' | 'pending' | 'approved_with_suggestions'
}

type ProfileUser = {
  name: string
  email?: string | null
  bitbucket_email?: string | null
  avatar_url?: string | null
}

interface UserReviewStatusBadgeProps {
  reviewers: Reviewer[]
  currentUser: ProfileUser
}

function isCurrentUserReviewer(reviewer: { name: string; email?: string }, profileUser: ProfileUser): boolean {
  if (reviewer.email && (reviewer.email === profileUser.email || reviewer.email === profileUser.bitbucket_email)) {
    return true
  }
  return reviewer.name === profileUser.name
}

export function UserReviewStatusBadge({ reviewers, currentUser }: UserReviewStatusBadgeProps) {
  const currentUserReview = reviewers.find((reviewer) => isCurrentUserReviewer(reviewer, currentUser))

  if (!currentUserReview) {
    return null
  }

  const { status } = currentUserReview

  return <ReviewerStatusIcon status={status} className="size-6 ring-2 ring-background" iconSize="size-3.5" />
}
