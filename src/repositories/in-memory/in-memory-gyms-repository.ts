import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyProps, GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinate'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id === id) || null
    return gym
  }

  async create({
    latitude,
    longitude,
    title,
    description = null,
    phone = null,
    id,
  }: Prisma.GymCreateInput): Promise<Gym> {
    const gym = {
      id: id ?? randomUUID(),
      latitude: new Prisma.Decimal(latitude.toString()),
      longitude: new Prisma.Decimal(longitude.toString()),
      title,
      description,
      phone,
    }

    this.items.push(gym)

    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    return this.items
      .filter((item) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyProps): Promise<Gym[]> {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }
}
