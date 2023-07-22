import { UserInvalidCredentialsError } from '@src/services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@src/services/factories/make-authenticate-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)
  try {
    const authenticateService = makeAuthenticateService()

    await authenticateService.execute({ email, password })
  } catch (err) {
    if (err instanceof UserInvalidCredentialsError) {
      return res.status(400).send({ message: err.message, error: true })
    }
    throw err
  }

  return res.status(200).send()
}
