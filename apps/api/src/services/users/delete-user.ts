import { UsersRepository } from '@/repositories/users-repository'

import { UserNotFoundError } from '../_errors/user-not-found-error'

interface DeleteUserServiceRequest {
  id: string
}

export class DeleteUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserServiceRequest): Promise<void> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    await this.usersRepository.deleteById(id)
  }
}
