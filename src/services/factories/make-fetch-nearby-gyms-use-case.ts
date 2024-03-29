import { PrismaGymsRepository } from '@src/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsService } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const service = new FetchNearbyGymsService(gymsRepository)

  return service
}
