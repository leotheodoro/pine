import { PrismaUsersRepository } from '../../../repositories/prisma/prisma-users-repository'
import { ListAzurePullRequestsService } from '../../integrations/azure/list-azure-pull-requests'

export function makeListAzurePullRequestsService() {
  const usersRepository = new PrismaUsersRepository()
  const listAzurePullRequestsService = new ListAzurePullRequestsService(usersRepository)
  return listAzurePullRequestsService
}
