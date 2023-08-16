import { Gym, Prisma } from '@prisma/client'

export interface IGymsRepository {
  findById(userId: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}
