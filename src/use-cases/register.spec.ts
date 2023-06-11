import { describe, expect, it, beforeEach } from 'vitest'
import { RegisterUserCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './error/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let registerUserCase: RegisterUserCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUserCase = new RegisterUserCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerUserCase.execute({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUserCase.execute({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should bot be able to register with same email twice', async () => {
    const user = {
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    }

    await registerUserCase.execute(user)

    await expect(() => registerUserCase.execute(user)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
