'use client'

import { useQuery } from '@tanstack/react-query'
import { ExternalLink, GitPullRequest, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfile } from '@/hooks/use-profile'
import { listAllPullRequests } from '@/http/pull-requests/list-all-pull-requests'

export function PullRequestList() {
  const { data: profile } = useProfile()
  const { data, isLoading } = useQuery({
    queryKey: ['pull-requests'],
    queryFn: listAllPullRequests,
  })

  // Filter PRs where the user is a reviewer
  const prsToReview =
    data?.pullRequests.filter((pr) => {
      if (!profile?.user) return false

      if (pr.author.email === profile.user.email || pr.author.email === profile.user.bitbucket_email) {
        return false
      }

      // Azure DevOps uses email (uniqueName)
      if (pr.provider === 'azure') {
        return pr.reviewers.some(
          (reviewer) =>
            (reviewer.email === profile.user.email || reviewer.email === profile.user.bitbucket_email) &&
            reviewer.status !== 'approved' // Fallback if they share email
        )
      }

      // Bitbucket - match display name if email is missing or match email if present
      // Note: Bitbucket API privacy settings might hide email.
      if (pr.provider === 'bitbucket') {
        return pr.reviewers.some((reviewer) => {
          // If we have an email match, great
          if (
            reviewer.email &&
            (reviewer.email === profile.user.email || reviewer.email === profile.user.bitbucket_email) &&
            reviewer.status !== 'approved'
          ) {
            return true
          }
          // Fallback to name match - risky but better than nothing for now
          // A more robust way would be to fetch current user UUID from BB
          return reviewer.name === profile.user.name
        })
      }

      return false
    }) ?? []

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Pull Requests to Review</CardTitle>
        <CardDescription>You have {prsToReview.length} pending reviews.</CardDescription>
      </CardHeader>
      <CardContent>
        {prsToReview.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 text-muted-foreground">
            <GitPullRequest className="size-8 opacity-50" />
            <p>No pending reviews found.</p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
              {prsToReview.map((pr) => (
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
