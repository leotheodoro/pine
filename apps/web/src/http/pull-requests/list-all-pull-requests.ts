import { api } from '@/lib/ky'

export interface PullRequest {
  provider: 'bitbucket' | 'azure'
  id: string
  title: string
  description: string
  status: 'open' | 'merged' | 'closed'
  isDraft: boolean
  url: string
  createdAt: string
  updatedAt: string
  author: {
    name: string
    email?: string
    avatarUrl?: string
  }
  sourceBranch: string
  targetBranch: string
  repository: {
    name: string
  }
  reviewers: {
    name: string
    email?: string
    avatarUrl?: string
    status: 'pending' | 'approved' | 'changes_requested' | 'rejected' | 'approved_with_suggestions'
  }[]
}

interface ListAllPullRequestsResponse {
  pullRequests: PullRequest[]
  summary: {
    total: number
    byProvider: {
      bitbucket: number
      azure: number
    }
  }
  errors?: {
    repository: string
    provider: string
    error: string
  }[]
}

export async function listAllPullRequests(options?: { includeCompleted?: boolean }) {
  const searchParams =
    options?.includeCompleted === true ? new URLSearchParams({ includeCompleted: 'true' }) : undefined
  const url = searchParams ? `integrations/pull-requests?${searchParams}` : 'integrations/pull-requests'
  const result = await api.get(url).json<ListAllPullRequestsResponse>()

  return result
}
