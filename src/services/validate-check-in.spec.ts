import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@src/repositories/in-memory/in-memory-checkin-repository'
import { ValidateService } from './validate-check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateService
describe('Validate check in Service', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateService(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to validate the check-in ', async () => {
    const checkIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    await sut.execute({
      checkInId: checkIn.id,
    })
    await expect(checkIn.validated_at).toEqual(expect.any(Date))
    await expect(checkInsRepository.items[0].validated_at).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to validate the check-in after 20 minutes of its creation ', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // utc
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    const HALF_AN_HOURS = 1000 * 60 * 30
    vi.advanceTimersByTime(HALF_AN_HOURS)
    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })
    expect(checkIn).rejects.toBeInstanceOf(Error)
  })
})
