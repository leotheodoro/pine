import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { UpdateUserService } from '../../users/update-user'

export function makeUpdateUserService() {
  const usersRepository = new PrismaUsersRepository()
  const updateUserService = new UpdateUserService(usersRepository)

  return updateUserService
}
