import { FastifyInstance } from 'fastify'
import { SESSION_PATH, USERS_PATH } from '@/constants/url-paths'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'

export async function appRoutes(app: FastifyInstance) {
  app.post(USERS_PATH, register)
  app.post(SESSION_PATH, authenticate)
}
