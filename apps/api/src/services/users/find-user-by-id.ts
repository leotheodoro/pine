import { User } from 'generated'

import { UsersRepository } from '@/repositories/users-repository'

interface FindUserByIdServiceRequest {
  id: string
}

interface FindUserByIdServiceResponse {
  user: User | null
}

export class FindUserByIdService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: FindUserByIdServiceRequest): Promise<FindUserByIdServiceResponse> {
    const user = await this.usersRepository.findById(id)

    return { user }
  }
}
