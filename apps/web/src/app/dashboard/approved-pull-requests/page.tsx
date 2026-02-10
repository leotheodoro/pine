import { PullRequestList } from '@/components/pull-request-list'

export default function ApprovedPullRequestsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-semibold">Approved pull requests</h1>
        <p className="text-muted-foreground">
          Pull requests you have already approved across your connected repositories.
        </p>
      </div>

      <PullRequestList variant="approved-by-me" />
    </div>
  )
}
