import { createAzureDevOpsClient } from '../../../lib/azure'
import { UsersRepository } from '../../../repositories/users-repository'
import { IntegrationCredentialsMissingError } from '../../_errors/integration-credentials-missing-error'
import {
  AzureRawPullRequest,
  ListAzurePullRequestsServiceRequest,
  ListAzurePullRequestsServiceResponse,
  PullRequest,
} from '../types'

export class ListAzurePullRequestsService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId, repoId }: ListAzurePullRequestsServiceRequest): Promise<ListAzurePullRequestsServiceResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    if (!user.azure_devops_org || !user.azure_devops_pat || !user.azure_devops_project) {
      throw new IntegrationCredentialsMissingError('Azure DevOps')
    }

    const client = createAzureDevOpsClient(user.azure_devops_org, user.azure_devops_pat)

    const response = await client.get(
      `/${encodeURIComponent(user.azure_devops_project)}/_apis/git/repositories/${encodeURIComponent(repoId)}/pullrequests`,
      {
        params: {
          'searchCriteria.status': 'active',
          $top: 100,
          'api-version': '7.1',
        },
      }
    )

    const rawPullRequests: AzureRawPullRequest[] = response.data?.value ?? []

    const pullRequests: PullRequest[] = rawPullRequests.map((pr) => {
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
    })

    return {
      pullRequests,
    }
  }
}
