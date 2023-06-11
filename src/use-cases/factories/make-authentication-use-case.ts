import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUserCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new AuthenticateUseCase(usersRepository)

  return useCase
}
