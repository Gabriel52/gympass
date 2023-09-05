import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-checkin-repository'
import { FetchUserCheckInsHistoryService } from './fetch-member-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryService
describe('Fetch user check ins history Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryService(checkInsRepository)
  })

  it('should be able to check in history ', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    await expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let count = 1; count <= 22; count++) {
      await checkInsRepository.create({
        gym_id: `gym-${count}`,
        user_id: 'user-01',
      })
    }
    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    await expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
