import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-checkin-repository'
import { FetchUserCheckInsHistoryService } from './fetch-member-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryService
describe('Fetch user check ins history Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryService(checkInsRepository)

    // await gymsRepository.create({
    //   id: 'gym-01',
    //   title: 'Academia das maravilhas',
    //   description: 'Onde você malha todo dia',
    //   phone: '123324324',
    //   latitude: new Decimal(23213213),
    //   longitude: new Decimal(23213213213),
    // })
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
    })

    await expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })
})
