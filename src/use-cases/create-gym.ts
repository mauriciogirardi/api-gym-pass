import { Gym } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  description?: string | null
  phone?: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    latitude,
    longitude,
    title,
    description,
    phone,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
      phone,
    })

    return {
      gym,
    }
  }
}
