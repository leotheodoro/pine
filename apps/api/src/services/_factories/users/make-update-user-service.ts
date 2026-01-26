import { PrismaRepositoriesRepository } from '@/repositories/prisma/prisma-repositories-repository'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { UpdateUserService } from '../../users/update-user'

export function makeUpdateUserService() {
  const usersRepository = new PrismaUsersRepository()
  const repositoriesRepository = new PrismaRepositoriesRepository()
  const updateUserService = new UpdateUserService(usersRepository, repositoriesRepository)

  return updateUserService
}
