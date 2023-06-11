import { InvalidCredentialsError } from '@/use-cases/error/invalid-credentials-error'
import { makeAuthenticateUserCase } from '@/use-cases/factories/make-authentication-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<{ token: string }> {
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

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    throw err
  }
}
