import { CheckIn } from '@prisma/client'
import { ICheckInsRepository } from '@src/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LIMIT_IN_MINUTES_TO_VALIDATE_CHECK_IN } from '@src/const'
import { LateCheckInValidationError } from './errors/late_check-in-validation-error'

interface ValidateServiceRequest {
  checkInId: string
}

interface ValidateServiceResponse {
  checkIn: CheckIn
}

export class ValidateService {
  constructor(private checkInsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateServiceRequest): Promise<ValidateServiceResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }
    const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (
      distanceInMinutesFromCheckInCreation >
      LIMIT_IN_MINUTES_TO_VALIDATE_CHECK_IN
    ) {
      throw new LateCheckInValidationError()
    }
    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)
    return { checkIn }
  }
}
