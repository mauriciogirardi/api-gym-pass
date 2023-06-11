import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = request.user.sub
    const getUserProfile = makeGetUserProfileUseCase()

    const { user } = await getUserProfile.execute({ userId })

    return reply
      .status(200)
      .send({ user: { ...user, password_hash: undefined } })
  } catch (error) {
    console.error(error)
  }
}
