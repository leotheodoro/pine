import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FindUserByIdService } from '@/services/users/find-user-by-id'

export function makeFindUserByIdService() {
  const usersRepository = new PrismaUsersRepository()
  const findUserByIdService = new FindUserByIdService(usersRepository)

  return findUserByIdService
}
