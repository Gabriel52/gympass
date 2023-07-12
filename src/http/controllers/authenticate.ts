import { PrismaUsersRepository } from '@src/repositories/prisma/prisma-users-repository'
import { AuthenticateService } from '@src/services/authenticate'
import { UserInvalidCredentialsError } from '@src/services/errors/invalid-credentials-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)
  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const authenticateService = new AuthenticateService(prismaUsersRepository)

    await authenticateService.execute({ email, password })
  } catch (err) {
    if (err instanceof UserInvalidCredentialsError) {
      return res.status(400).send({ message: err.message, error: true })
    }
    throw err
  }

  return res.status(200).send()
}
