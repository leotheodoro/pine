import { PullRequestList } from '@/components/pull-request-list'

export default function MyMergedPullRequestsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold">My Merged pull requests</h1>
        <p className="text-muted-foreground">
          Pull requests you created that have been merged — your completed work across repositories.
        </p>
      </div>

      <PullRequestList variant="my-merged" />
    </div>
  )
}
