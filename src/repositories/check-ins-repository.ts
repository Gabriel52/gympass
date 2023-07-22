import { Prisma, CheckIn } from '@prisma/client'

export interface ICheckInsService {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
