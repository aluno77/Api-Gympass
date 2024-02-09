import fastifyCokie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { checkInsRoutes } from './http/controllers/checkIns/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { usersRoutes } from './http/controllers/users/routes'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken', // Cookie name
    signed: false, // Indicates if the cookie signature is required
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCokie) // Plugin para manipular cookies

app.register(usersRoutes)
app.register(checkInsRoutes)
app.register(gymsRoutes)

// Configuração de error Global
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV === 'production') {
    console.error(error)
  } else {
    // TODO: Here should be a log to an external tool like/Datalog or Sentry
  }

  return reply.status(500).send({ message: 'Internal server error' })
})
