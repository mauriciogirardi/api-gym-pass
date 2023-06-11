import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './error/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile ', async () => {
    const newUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john@doe.com',
      password_hash: '123456',
    })

    const { user } = await getUserProfileUseCase.execute({ userId: newUser.id })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong id or without id', async () => {
    await expect(
      getUserProfileUseCase.execute({ userId: '' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)

    await expect(
      getUserProfileUseCase.execute({ userId: 'efwefwefwef' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
