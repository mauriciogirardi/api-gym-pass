import { compare } from 'bcryptjs'
import { UsersRepository } from '../repositories/users-repository'
import { InvalidCredentialsError } from './error/invalid-credentials-error'
import { User } from '@prisma/client'

interface AuthenticateUseCaseResponse {
  user: User
}

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) throw new InvalidCredentialsError()

    const doesPasswordMatches = await compare(password, user.password_hash)
    if (!doesPasswordMatches) throw new InvalidCredentialsError()

    return {
      user,
    }
  }
}
