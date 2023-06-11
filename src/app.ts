import fastify from 'fastify'
import { fastifyJwt } from '@fastify/jwt'
import { ZodError } from 'zod'
import { appRoutes } from './http/routes'
import { env } from './env'

const { JWT_SECRET, NODE_ENV } = env

export const app = fastify()

app.register(fastifyJwt, {
  secret: JWT_SECRET,
})
app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error!', issues: error.format() })
  }

  if (NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO Here we should log to an external tool like DataDog/NewRelic/Sentry.
  }

  return reply.status(500).send({ message: 'Internal server error!' })
})
