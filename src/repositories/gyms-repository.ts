import { Gym, Prisma } from '@prisma/client'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface IGymsRepository {
  findById(userId: string): Promise<Gym | null>
  searchManyByQuery(query: string, page: number): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findManyNearby({ latitude, longitude }: FindManyNearbyParams): Promise<Gym[]>
}
