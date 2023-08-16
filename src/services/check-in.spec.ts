import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-checkin-repository'
import { CheckInService } from './check-in'
import { InMemoryGymsRepository } from '@src/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime'
import { MaxNumberOdCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInService
let gymsRepository: InMemoryGymsRepository
describe('CheckIn Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInService(checkInsRepository, gymsRepository)
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia das maravilhas',
      description: 'Onde você malha todo dia',
      phone: '123324324',
      latitude: new Decimal(23213213),
      longitude: new Decimal(23213213213),
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to check in ', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 23213213,
      userLongitude: 23213213213,
    })
    await expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in twice in the same day', async () => {
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 23213213,
      userLongitude: 23213213213,
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 23213213,
        userLongitude: 23213213213,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOdCheckInsError)
  })

  it('should be able to check in twice in the same day, however in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 23213213,
      userLongitude: 23213213213,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 23213213,
      userLongitude: 23213213213,
    })

    await expect(checkIn.id).toEqual(expect.any(String))
  })
  it('should not be able to check in on distant gym ', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia das maravilhas',
      description: 'Onde você malha todo dia',
      latitude: new Decimal(-23.652092),
      longitude: new Decimal(-46.8275333),
      phone: '123324324',
    })
    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.5425113,
        userLongitude: -46.6541346,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
