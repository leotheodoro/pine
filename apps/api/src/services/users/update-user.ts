import { hash } from 'bcryptjs'
import { User } from 'generated'

import { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExistsError } from '../_errors/user-already-exists-error'
import { UserNotFoundError } from '../_errors/user-not-found-error'

interface UpdateUserServiceRequest {
  id: string
  name?: string
  email: string
  password?: string
  username: string
  avatar_url?: string
  bitbucket_email?: string
  bitbucket_api_token?: string
  bitbucket_workspace?: string
  azure_devops_org?: string
  azure_devops_pat?: string
  azure_devops_project?: string
}

interface UpdateUserServiceResponse {
  user: User
}

export class UpdateUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    id,
    name,
    email,
    password,
    username,
    avatar_url,
    bitbucket_email,
    bitbucket_api_token,
    bitbucket_workspace,
    azure_devops_org,
    azure_devops_pat,
    azure_devops_project,
  }: UpdateUserServiceRequest): Promise<UpdateUserServiceResponse> {
    const user = await this.usersRepository.findById(id)

    if (!user) {
      throw new UserNotFoundError()
    }

    const existingUserWithEmail = await this.usersRepository.findByEmail(email)

    if (existingUserWithEmail && existingUserWithEmail.id !== id) {
      throw new UserAlreadyExistsError()
    }

    let passwordHash = user.password_hash
    if (password) {
      passwordHash = await hash(password, 6)
    }

    const updatedUser = await this.usersRepository.update(id, {
      name,
      email,
      password_hash: passwordHash,
      username,
      avatar_url,
      bitbucket_email,
      bitbucket_api_token,
      bitbucket_workspace,
      azure_devops_org,
      azure_devops_pat,
      azure_devops_project,
    })

    return { user: updatedUser }
  }
}
