import { UsersRepository } from '../../repositories/users-repository'
import { ListAzurePullRequestsService } from './azure/list-azure-pull-requests'
import { ListBitbucketPullRequestsService } from './bitbucket/list-bitbucket-pull-requests'
import { ListAllPullRequestsServiceRequest, ListAllPullRequestsServiceResponse } from './types'

export class ListAllPullRequestsService {
  constructor(
    private usersRepository: UsersRepository,
    private listBitbucketPullRequestsService: ListBitbucketPullRequestsService,
    private listAzurePullRequestsService: ListAzurePullRequestsService
  ) {}

  async execute({
    userId,
    bitbucket,
    azure,
  }: ListAllPullRequestsServiceRequest): Promise<ListAllPullRequestsServiceResponse> {
    const pullRequests: ListAllPullRequestsServiceResponse['pullRequests'] = []
    const sources = { bitbucket: false, azure: false }
    const errors: ListAllPullRequestsServiceResponse['errors'] = {}

    if (bitbucket) {
      try {
        const result = await this.listBitbucketPullRequestsService.execute({
          userId,
          repoSlug: bitbucket.repoSlug,
        })
        pullRequests.push(...result.pullRequests)
        sources.bitbucket = true
      } catch (error) {
        errors.bitbucket = error instanceof Error ? error.message : 'Failed to fetch Bitbucket pull requests'
      }
    }

    if (azure) {
      try {
        const result = await this.listAzurePullRequestsService.execute({
          userId,
          repoId: azure.repoId,
        })
        pullRequests.push(...result.pullRequests)
        sources.azure = true
      } catch (error) {
        errors.azure = error instanceof Error ? error.message : 'Failed to fetch Azure DevOps pull requests'
      }
    }

    return {
      pullRequests,
      sources,
      ...(Object.keys(errors).length > 0 && { errors }),
    }
  }
}
