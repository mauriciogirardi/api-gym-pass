import { PrismaUsersRepository } from '@/http/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUserCase() {
  const usersRepository = new PrismaUsersRepository()
  const authenticateUserCase = new AuthenticateUseCase(usersRepository)

  return authenticateUserCase
}
