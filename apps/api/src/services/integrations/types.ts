export interface PullRequest {
  provider: 'azure' | 'bitbucket'

  id: string | number
  title: string
  description: string
  status: 'open' | 'closed' | 'merged' | 'draft'
  isDraft: boolean
  url: string

  createdAt: string
  updatedAt: string

  author: {
    name: string
    email?: string
    avatarUrl: string
  }

  sourceBranch: string
  targetBranch: string

  reviewers: Array<{
    name: string
    email?: string
    avatarUrl?: string
    status: 'approved' | 'changes_requested' | 'rejected' | 'pending' | 'approved_with_suggestions'
    participatedAt?: string // Bitbucket only
  }>

  repository?: {
    name?: string
  }
}

export interface ListBitbucketPullRequestsServiceRequest {
  userId: string
  workspace?: string
  repoSlug: string
}

export interface ListBitbucketPullRequestsServiceResponse {
  pullRequests: PullRequest[]
}

export interface ListAzurePullRequestsServiceRequest {
  userId: string
  project: string
  repoId: string
}

export interface ListAzurePullRequestsServiceResponse {
  pullRequests: PullRequest[]
}

export interface ListAllPullRequestsServiceRequest {
  userId: string
  bitbucket?: {
    workspace?: string
    repoSlug: string
  }
  azure?: {
    project: string
    repoId: string
  }
}

export interface ListAllPullRequestsServiceResponse {
  pullRequests: PullRequest[]
  sources: {
    bitbucket: boolean
    azure: boolean
  }
  errors?: {
    bitbucket?: string
    azure?: string
  }
}

export interface BitbucketRawPullRequest {
  id: number
  title: string
  description: string
  state: string
  draft: boolean
  author: {
    display_name: string
    links: {
      avatar: {
        href: string
      }
    }
  }
  participants: Array<{
    user: {
      uuid: string
      display_name: string
      nickname: string
      links: {
        avatar: {
          href: string
        }
      }
    }
    role: string
    approved: boolean
    state: string | null
    participated_on: string
  }>
  created_on: string
  updated_on: string
  destination: {
    branch: {
      name: string
    }
    repository: {
      name: string
    }
  }
  source: {
    branch: {
      name: string
    }
  }
  links: {
    self: {
      href: string
    }
    approve: {
      href: string
    }
    request_changes: {
      href: string
    }
    decline: {
      href: string
    }
  }
}

export interface AzureRawPullRequest {
  pullRequestId: number
  repository: {
    name: string
  }
  status: string
  createdBy: {
    displayName: string
    imageUrl: string
    uniqueName: string // Email
  }
  title: string
  description: string
  isDraft: boolean
  sourceRefName: string
  targetRefName: string
  reviewers: Array<{
    displayName: string
    vote: number // 10 - approved, -5 requested with changes, 0 - not reviewed, 5 - approved with suggestions, -10 - rejected
    hasDeclined: boolean
    isFlagged: boolean
    uniqueName: string // Email
    imageUrl: string
  }>
  url: string
  creationDate: string
}
