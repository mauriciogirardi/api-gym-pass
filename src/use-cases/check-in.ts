import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { InvalidCheckInError } from './error/invalid-check-in-error'
import { GymsRepository } from '../repositories/gyms-repository'
import { ResourceNotFoundError } from './error/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinate'
import { MaxDistanteError } from './error/max-distance-error'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

const MAX_DISTANCE = 0.1 // 100 metros

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) throw new ResourceNotFoundError()

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    if (distance > MAX_DISTANCE) throw new MaxDistanteError()

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkInOnSameDate) throw new InvalidCheckInError()

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
