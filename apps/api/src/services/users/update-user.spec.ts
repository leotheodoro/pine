import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from '../_errors/user-already-exists-error'
import { UserNotFoundError } from '../_errors/user-not-found-error'
import { UpdateUserService } from './update-user'

let usersRepository: InMemoryUsersRepository
let sut: UpdateUserService

describe('Update User Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new UpdateUserService(usersRepository)
  })

  it('should be able to update an user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      username: 'johndoe',
    })

    const { user: updatedUser } = await sut.execute({
      id: user.id,
      email: user.email,
      name: 'Updated User',
      username: user.username,
    })

    expect(updatedUser.id).toEqual(user.id)
    expect(updatedUser.name).toEqual('Updated User')
  })

  it('should throw an error when user does not exist', async () => {
    await expect(() =>
      sut.execute({
        id: 'non-existent-user',
        name: 'Updated User',
        email: 'johndoe@example.com',
        username: 'johndoe2',
      })
    ).rejects.toBeInstanceOf(UserNotFoundError)
  })

  it('should throw an error when user is trying to use an identifier from another user', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      username: 'johndoe',
    })

    await usersRepository.create({
      name: 'John Doe 2',
      email: 'johndoe2@example.com',
      password_hash: '123456',
      username: 'johndoe2',
    })

    await expect(() =>
      sut.execute({
        id: user.id,
        email: 'johndoe2@example.com',
        name: 'Updated User',
        username: 'johndoe2',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
