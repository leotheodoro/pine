import { createAzureDevOpsClient } from '../../lib/azure'
import { createBitbucketClient } from '../../lib/bitbucket'
import { RepositoriesRepository } from '../../repositories/repositories-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { IntegrationCredentialsMissingError } from '../_errors/integration-credentials-missing-error'
import {
  AzureRawPullRequest,
  BitbucketRawPullRequest,
  ListAllPullRequestsServiceRequest,
  ListAllPullRequestsServiceResponse,
  PullRequest,
} from './types'

export class ListAllPullRequestsService {
  constructor(
    private usersRepository: UsersRepository,
    private repositoriesRepository: RepositoriesRepository
  ) {}

  async execute({
    userId,
    includeCompleted = false,
  }: ListAllPullRequestsServiceRequest): Promise<ListAllPullRequestsServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const repositories = await this.repositoriesRepository.findByUserId(userId)

    const pullRequests: PullRequest[] = []
    const errors: ListAllPullRequestsServiceResponse['errors'] = []
    let bitbucketCount = 0
    let azureCount = 0

    const bitbucketFields =
      'values.id,values.title,values.description,values.state,values.draft,values.author.display_name,values.author.links.avatar.href,values.participants.user.uuid,values.participants.user.display_name,values.participants.user.nickname,values.participants.role,values.participants.approved,values.participants.state,values.participants.participated_on,values.participants.user.links.avatar.href,values.created_on,values.updated_on,values.destination.branch.name,values.source.branch.name,values.links.self.href,values.links.approve.href,values.links.request_changes.href,values.links.decline.href,values.destination.repository.name'

    for (const repo of repositories) {
      try {
        if (repo.provider === 'bitbucket') {
          if (!user.bitbucket_email || !user.bitbucket_api_token || !user.bitbucket_workspace) {
            throw new IntegrationCredentialsMissingError('Bitbucket')
          }

          const client = createBitbucketClient(user.bitbucket_email, user.bitbucket_api_token)
          const bitbucketStates: ('OPEN' | 'MERGED')[] = includeCompleted ? ['OPEN', 'MERGED'] : ['OPEN']

          for (const state of bitbucketStates) {
            const response = await client.get(
              `/repositories/${user.bitbucket_workspace}/${repo.identifier}/pullrequests`,
              {
                params: {
                  ...(state === 'OPEN' ? { state: 'OPEN' } : { q: 'state="MERGED"' }),
                  pagelen: 50,
                  sort: '-updated_on',
                  fields: bitbucketFields,
                },
              }
            )

            const rawPullRequests: BitbucketRawPullRequest[] = response.data?.values ?? []
            const repoPullRequests = rawPullRequests.map((pr) => this.mapBitbucketPR(pr))
            pullRequests.push(...repoPullRequests)
            bitbucketCount += repoPullRequests.length
          }
        } else if (repo.provider === 'azure') {
          if (!user.azure_devops_org || !user.azure_devops_pat || !user.azure_devops_project) {
            throw new IntegrationCredentialsMissingError('Azure DevOps')
          }

          const client = createAzureDevOpsClient(user.azure_devops_org, user.azure_devops_pat)
          const azureStatuses: ('active' | 'completed')[] = includeCompleted ? ['active', 'completed'] : ['active']

          for (const status of azureStatuses) {
            const response = await client.get(
              `/${encodeURIComponent(user.azure_devops_project)}/_apis/git/repositories/${encodeURIComponent(repo.identifier)}/pullrequests`,
              {
                params: {
                  'searchCriteria.status': status,
                  $top: 100,
                  'api-version': '7.1',
                },
              }
            )

            const rawPullRequests: AzureRawPullRequest[] = response.data?.value ?? []
            const repoPullRequests = rawPullRequests.map((pr) => this.mapAzurePR(pr))
            pullRequests.push(...repoPullRequests)
            azureCount += repoPullRequests.length
          }
        }
      } catch (error) {
        errors.push({
          repository: repo.identifier,
          provider: repo.provider,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return {
      pullRequests,
      summary: {
        total: pullRequests.length,
        byProvider: {
          bitbucket: bitbucketCount,
          azure: azureCount,
        },
      },
      ...(errors.length > 0 && { errors }),
    }
  }

  private mapBitbucketPR(pr: BitbucketRawPullRequest): PullRequest {
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
  }

  private mapAzurePR(pr: AzureRawPullRequest): PullRequest {
    const reviewers = pr.reviewers.map((reviewer) => {
      let status: PullRequest['reviewers'][0]['status'] = 'pending'

      if (reviewer.vote === 10) {
        status = 'approved'
      } else if (reviewer.vote === 5) {
        status = 'approved_with_suggestions'
      } else if (reviewer.vote === -5) {
        status = 'changes_requested'
      } else if (reviewer.vote === -10) {
        status = 'rejected'
      } else {
        status = 'pending'
      }

      return {
        name: reviewer.displayName,
        email: reviewer.uniqueName,
        avatarUrl: reviewer.imageUrl,
        status,
      }
    })

    return {
      provider: 'azure',
      id: pr.pullRequestId,
      title: pr.title,
      description: pr.description,
      status:
        pr.status.toLowerCase() === 'active' ? 'open' : pr.status.toLowerCase() === 'completed' ? 'merged' : 'closed',
      isDraft: pr.isDraft,
      url: pr.url,
      createdAt: pr.creationDate,
      updatedAt: pr.creationDate,
      author: {
        name: pr.createdBy.displayName,
        email: pr.createdBy.uniqueName,
        avatarUrl: pr.createdBy.imageUrl,
      },
      sourceBranch: pr.sourceRefName,
      targetBranch: pr.targetRefName,
      reviewers,
      repository: {
        name: pr.repository.name,
      },
    }
  }
}
