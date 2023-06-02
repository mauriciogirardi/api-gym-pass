import { FastifyReply, FastifyRequest } from 'fastify'
import { UserAlreadyExistsError } from '../use-cases/error/user-already-exists-error'
import { makeRegisterUseCase } from '../use-cases/factories/make-register-use-case'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  try {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, name, password } = registerBodySchema.parse(request.body)

    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({ email, name, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }

  return reply.status(201).send()
}
