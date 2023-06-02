import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'

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
}
