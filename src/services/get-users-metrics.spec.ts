import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-checkin-repository'
import { GetUsersMetricsService } from './get-users-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUsersMetricsService
describe('Get User Metrics Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUsersMetricsService(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics ', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    await expect(checkInsCount).toEqual(2)
  })
})
