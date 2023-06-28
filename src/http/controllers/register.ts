import { PrismaUsersRepository } from '@src/repositories/prisma-users-repository'
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
    return res.status(409).send()
  }

  return res.status(201).send()
}
