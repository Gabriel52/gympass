import { Prisma } from '@prisma/client'
import { prismaObject } from '@src/lib/prisma'

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prismaObject.user.create({
      data,
    })

    return user
  }
}
