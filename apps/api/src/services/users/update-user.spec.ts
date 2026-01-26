import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryRepositoriesRepository } from '@/repositories/in-memory/in-memory-repositories-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from '../_errors/user-already-exists-error'
import { UserNotFoundError } from '../_errors/user-not-found-error'
import { UpdateUserService } from './update-user'

let usersRepository: InMemoryUsersRepository
let repositoriesRepository: InMemoryRepositoriesRepository
let sut: UpdateUserService

describe('Update User Service', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    repositoriesRepository = new InMemoryRepositoriesRepository()
    sut = new UpdateUserService(usersRepository, repositoriesRepository)
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
      bitbucket_api_token: '123456',
    })

    expect(updatedUser.id).toEqual(user.id)
    expect(updatedUser.bitbucket_api_token).toEqual('123456')
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

  it('should be able to sync repositories', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
      username: 'johndoe',
    })

    await sut.execute({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      repositories: [
        { provider: 'bitbucket', identifier: 'repo-slug-1' },
        { provider: 'azure', identifier: 'repo-id-1' },
      ],
    })

    let repos = await repositoriesRepository.findByUserId(user.id)
    expect(repos).toHaveLength(2)

    await sut.execute({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      repositories: [{ provider: 'bitbucket', identifier: 'repo-slug-2' }],
    })

    repos = await repositoriesRepository.findByUserId(user.id)
    expect(repos).toHaveLength(1)
    expect(repos[0].identifier).toEqual('repo-slug-2')
  })
})
