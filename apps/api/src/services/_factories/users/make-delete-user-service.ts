import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { DeleteUserService } from '@/services/users/delete-user'

export function makeDeleteUserService() {
  const usersRepository = new PrismaUsersRepository()
  const deleteUserService = new DeleteUserService(usersRepository)

  return deleteUserService
}
