import { Greeting } from '@/components/greeting'
import { PullRequestList } from '@/components/pull-request-list'

export default function Page() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <Greeting />
        <p className="text-muted-foreground">Here are the pull requests pending your review.</p>
      </div>

      <PullRequestList />
    </div>
  )
}
