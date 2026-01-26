import { createBitbucketClient } from '../../../lib/bitbucket'
import { UsersRepository } from '../../../repositories/users-repository'
import { IntegrationCredentialsMissingError } from '../../_errors/integration-credentials-missing-error'
import {
  BitbucketRawPullRequest,
  ListBitbucketPullRequestsServiceRequest,
  ListBitbucketPullRequestsServiceResponse,
  PullRequest,
} from '../types'

export class ListBitbucketPullRequestsService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    repoSlug,
  }: ListBitbucketPullRequestsServiceRequest): Promise<ListBitbucketPullRequestsServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.bitbucket_email || !user.bitbucket_api_token || !user.bitbucket_workspace) {
      throw new IntegrationCredentialsMissingError('Bitbucket')
    }

    const client = createBitbucketClient(user.bitbucket_email, user.bitbucket_api_token)

    const response = await client.get(`/repositories/${user.bitbucket_workspace}/${repoSlug}/pullrequests`, {
      params: {
        state: 'OPEN',
        pagelen: 50,
        sort: '-updated_on',
        fields: `values.id,values.title,values.description,values.state,values.draft,values.author.display_name,values.author.links.avatar.href,values.participants.user.uuid,values.participants.user.display_name,values.participants.user.nickname,values.participants.role,values.participants.approved,values.participants.state,values.participants.participated_on,values.participants.user.links.avatar.href,values.created_on,values.updated_on,values.destination.branch.name,values.source.branch.name,values.links.self.href,values.links.approve.href,values.links.request_changes.href,values.links.decline.href,values.destination.repository.name`,
      },
    })

    const rawPullRequests: BitbucketRawPullRequest[] = response.data?.values ?? []

    const pullRequests: PullRequest[] = rawPullRequests.map((pr) => {
      const author = pr.author

      const reviewers = pr.participants
        .filter((p) => p.role === 'REVIEWER')
        .map((p) => {
          let status: PullRequest['reviewers'][0]['status'] = 'pending'

          if (p.state === null) {
            status = 'pending'
          } else if (p.approved) {
            status = 'approved'
          } else if (p.state === 'changes_requested') {
            status = 'changes_requested'
          }

          return {
            name: p.user.display_name,
            email: undefined,
            avatarUrl: p.user.links?.avatar?.href,
            status,
            participatedAt: p.participated_on,
          }
        })

      return {
        provider: 'bitbucket',
        id: pr.id,
        title: pr.title,
        description: pr.description,
        status: pr.state.toLowerCase() === 'open' ? 'open' : pr.state.toLowerCase() === 'merged' ? 'merged' : 'closed',
        isDraft: pr.draft,
        url: pr.links.self.href,
        createdAt: pr.created_on,
        updatedAt: pr.updated_on,
        author: {
          name: author.display_name,
          avatarUrl: author.links.avatar.href,
        },
        sourceBranch: pr.source.branch.name,
        targetBranch: pr.destination.branch.name,
        reviewers,
        repository: {
          name: pr.destination.repository.name,
        },
      }
    })

    return {
      pullRequests,
    }
  }
}
