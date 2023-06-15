import { PrismaClient } from '@prisma/client'
import { env } from '@src/env'

export const prismaObject = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
