import { hash } from 'bcryptjs'
import { User } from 'generated'

import { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExistsError } from '../_errors/user-already-exists-error'

interface CreateUserServiceRequest {
  name: string
  email: string
  password: string
  username: string
  avatar_url?: string | null
}

interface CreateUserServiceResponse {
  user: User
}

export class CreateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
    username,
    avatar_url,
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const passwordHash = await hash(password, 6)

    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
      username,
      avatar_url,
    })

    return { user }
  }
}
