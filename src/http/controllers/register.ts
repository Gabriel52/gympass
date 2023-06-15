import { prismaObject } from '@src/lib/prisma'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  await prismaObject.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })

  return res.status(201).send()
}
