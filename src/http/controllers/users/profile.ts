import { FastifyReply, FastifyRequest } from 'fastify'

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-user-case'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // await request.jwtVerify()

  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })
  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined, // remove password_hash from response
    },
  })
}
