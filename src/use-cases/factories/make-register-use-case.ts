import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUserCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const useCase = new RegisterUserCase(usersRepository)
  return useCase
}
