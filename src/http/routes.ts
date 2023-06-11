import { FastifyInstance } from 'fastify'
import { ME_PATH, SESSION_PATH, USERS_PATH } from '@/constants/url-paths'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post(USERS_PATH, register)
  app.post(SESSION_PATH, authenticate)

  // Authenticated
  app.get(ME_PATH, { onRequest: [verifyJWT] }, profile)
}
