'use client'

import { useQuery } from '@tanstack/react-query'
import { ExternalLink, GitPullRequest, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfile } from '@/hooks/use-profile'
import { listAllPullRequests } from '@/http/pull-requests/list-all-pull-requests'

type ProfileUser = {
  name: string
  email?: string | null
  bitbucket_email?: string | null
  bitbucket_workspace?: string | null
  azure_devops_org?: string | null
  azure_devops_project?: string | null
}

function isCurrentUserReviewer(reviewer: { name: string; email?: string }, profileUser: ProfileUser): boolean {
  if (reviewer.email && (reviewer.email === profileUser.email || reviewer.email === profileUser.bitbucket_email)) {
    return true
  }
  return reviewer.name === profileUser.name
}

function isApprovedByReviewer(status: string): boolean {
  return status === 'approved' || status === 'approved_with_suggestions'
}

export type PullRequestListVariant = 'to-review' | 'approved-by-me'

export function PullRequestList({ variant = 'to-review' }: { variant?: PullRequestListVariant }) {
  const { data: profile } = useProfile()
  const includeCompleted = variant === 'approved-by-me'
  const { data, isLoading } = useQuery({
    queryKey: ['pull-requests', { includeCompleted }],
    queryFn: () => listAllPullRequests({ includeCompleted }),
  })

  const filteredPRs = (data?.pullRequests ?? []).filter((pr) => {
    if (!profile?.user) return false
    const user = profile.user as ProfileUser

    if (variant === 'to-review') {
      if (pr.author.email === user.email || pr.author.email === user.bitbucket_email) {
        return false
      }
      if (pr.provider === 'azure') {
        return pr.reviewers.some(
          (reviewer) => isCurrentUserReviewer(reviewer, user) && !isApprovedByReviewer(reviewer.status)
        )
      }
      if (pr.provider === 'bitbucket') {
        return pr.reviewers.some(
          (reviewer) => isCurrentUserReviewer(reviewer, user) && !isApprovedByReviewer(reviewer.status)
        )
      }
    }

    if (variant === 'approved-by-me') {
      if (pr.provider === 'azure') {
        return pr.reviewers.some(
          (reviewer) => isCurrentUserReviewer(reviewer, user) && isApprovedByReviewer(reviewer.status)
        )
      }
      if (pr.provider === 'bitbucket') {
        return pr.reviewers.some(
          (reviewer) => isCurrentUserReviewer(reviewer, user) && isApprovedByReviewer(reviewer.status)
        )
      }
    }

    return false
  })

  const sortedPRs = [...filteredPRs].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isApprovedView = variant === 'approved-by-me'
  const emptyMessage = isApprovedView ? 'No pull requests you approved found.' : 'No pending reviews found.'
  const cardTitle = isApprovedView ? 'Approved pull requests' : 'Pull Requests to Review'
  const cardDescription = isApprovedView
    ? `You approved ${sortedPRs.length} pull request${sortedPRs.length === 1 ? '' : 's'}.`
    : `You have ${sortedPRs.length} pending reviews.`

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedPRs.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-muted-foreground">
            <GitPullRequest className="size-8 opacity-50" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
              {sortedPRs.map((pr) => (
                <Link
                  key={`${pr.provider}-${pr.id}`}
                  href={
                    pr.provider === 'azure'
                      ? `https://dev.azure.com/${profile?.user.azure_devops_org}/${profile?.user.azure_devops_project}/_git/${pr.repository.name.toLowerCase()}/pullrequest/${pr.id}`
                      : `https://bitbucket.org/${profile?.user.bitbucket_workspace}/${pr.repository.name.toLowerCase()}/pull-requests/${pr.id}` // https://bitbucket.org/recruitrobin/atsgatewayapi/pull-requests/310
                  }
                  target="_blank"
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <Avatar className="mt-1 size-8">
                    <AvatarImage src={pr.author.avatarUrl} alt={pr.author.name} />
                    <AvatarFallback>{pr.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{pr.title}</span>
                      <ExternalLink className="size-4 shrink-0 text-muted-foreground opacity-50" />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{pr.provider}</span>
                      <span>•</span>
                      <span>{pr.repository.name}</span>
                      <span>•</span>
                      <span>{pr.author.name}</span>
                      {isApprovedView && (
                        <>
                          <span>•</span>
                          <span
                            className={
                              pr.status === 'merged'
                                ? 'font-medium text-green-600 dark:text-green-400'
                                : pr.status === 'open'
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : undefined
                            }
                          >
                            {pr.status === 'merged' ? 'Merged' : pr.status === 'open' ? 'Open' : pr.status}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
