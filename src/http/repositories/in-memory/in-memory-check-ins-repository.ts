import { Prisma, CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create({
    gym_id,
    user_id,
    validated_at,
  }: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: validated_at ? new Date() : null,
      gym_id,
      user_id,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate =
      this.items.find((checkIn) => {
        const checkInDate = dayjs(checkIn.created_at)
        const isOnSameDate =
          checkInDate.isAfter(startOfTheDay) &&
          checkInDate.isBefore(endOfTheDay)

        return checkIn.user_id === userId && isOnSameDate
      }) || null

    return checkInOnSameDate
  }
}
