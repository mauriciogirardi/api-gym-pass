import { PrismaUsersRepository } from '@/http/repositories/prisma/prisma-users-repository'
import { RegisterUserCase } from '../register'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUserCase(usersRepository)

  return registerUseCase
}
