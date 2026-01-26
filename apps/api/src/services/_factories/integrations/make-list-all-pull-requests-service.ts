import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository'
import { ListAzurePullRequestsService } from '../../integrations/azure/list-azure-pull-requests'
import { ListBitbucketPullRequestsService } from '../../integrations/bitbucket/list-bitbucket-pull-requests'
import { ListAllPullRequestsService } from '../../integrations/list-all-pull-requests'

export function makeListAllPullRequestsService() {
  const usersRepository = new PrismaUsersRepository()
  const listBitbucketPullRequestsService = new ListBitbucketPullRequestsService(usersRepository)
  const listAzurePullRequestsService = new ListAzurePullRequestsService(usersRepository)
  const listAllPullRequestsService = new ListAllPullRequestsService(
    usersRepository,
    listBitbucketPullRequestsService,
    listAzurePullRequestsService
  )
  return listAllPullRequestsService
}
