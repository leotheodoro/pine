import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository'
import { ListBitbucketPullRequestsService } from '../../integrations/bitbucket/list-bitbucket-pull-requests'

export function makeListBitbucketPullRequestsService() {
  const usersRepository = new PrismaUsersRepository()
  const listBitbucketPullRequestsService = new ListBitbucketPullRequestsService(usersRepository)
  return listBitbucketPullRequestsService
}
