import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeFetchCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history.use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  // aqui estamos chamando a fabrica para instanciar o useCase
  const fetchUserCheckInsUseCase = makeFetchCheckInsHistoryUseCase()

  const { checkIns } = await fetchUserCheckInsUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
