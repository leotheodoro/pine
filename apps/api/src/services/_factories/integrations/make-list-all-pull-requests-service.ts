import { PrismaRepositoriesRepository } from '../../../repositories/prisma/prisma-repositories-repository'
import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository'
import { ListAllPullRequestsService } from '../../integrations/list-all-pull-requests'

export function makeListAllPullRequestsService() {
  const usersRepository = new PrismaUsersRepository()
  const repositoriesRepository = new PrismaRepositoriesRepository()
  const listAllPullRequestsService = new ListAllPullRequestsService(usersRepository, repositoriesRepository)
  return listAllPullRequestsService
}
