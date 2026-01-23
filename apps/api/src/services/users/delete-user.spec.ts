import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserNotFoundError } from '../_errors/user-not-found-error'
import { DeleteUserService } from './delete-user'
import { FindUserByIdService } from './find-user-by-id'

let usersRepository: InMemoryUsersRepository
let sut: DeleteUserService
let findUserByIdService: FindUserByIdService

describe('Delete User Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteUserService(usersRepository)
    findUserByIdService = new FindUserByIdService(usersRepository)
  })

  it('should be able to delete an user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      username: 'johndoe',
    })

    await sut.execute({
      id: user.id,
    })

    const { user: foundUser } = await findUserByIdService.execute({ id: user.id })

    expect(foundUser).toBeNull()
  })

  it('should throw an error when user does not exist', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existent-user',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })
})
