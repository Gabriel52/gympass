import { PrismaUsersRepository } from '@src/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@src/services/errors/user-already-exists-error'
import { RegisterService } from '@src/services/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)
  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(prismaUsersRepository)

    await registerService.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return res.status(409).send({ message: err.message, error: true })
    }
    throw err
  }

  return res.status(201).send()
}
