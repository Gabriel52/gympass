import { PrismaGymsRepository } from '@src/repositories/prisma/prisma-gyms-repository'
import { SearchGymsService } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const service = new SearchGymsService(gymsRepository)

  return service
}
