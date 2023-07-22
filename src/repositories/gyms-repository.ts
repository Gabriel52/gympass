import { Gym } from '@prisma/client'

export interface IGymsRepository {
  findById(userId: string): Promise<Gym | null>
}
