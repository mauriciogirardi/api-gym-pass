import { FastifyReply, FastifyRequest } from 'fastify'
import { makeAuthenticateUserCase } from '../use-cases/factories/make-authentication-use-case'
import { InvalidCredentialsError } from '../use-cases/error/invalid-credentials-error'
import { User } from '@prisma/client'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<User> {
  try {
    const authenticateUserCase = makeAuthenticateUserCase()

    const authBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = authBodySchema.parse(request.body)

    const { user } = await authenticateUserCase.execute({
      email,
      password,
    })

    return reply.send({ user })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    throw err
  }
}
