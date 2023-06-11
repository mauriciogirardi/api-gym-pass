import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyProps, GymsRepository } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: { id },
    })
    return gym
  }

  async create(data: Prisma.GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    })
    return gym
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyProps): Promise<Gym[]> {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE (6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
    return gyms
  }
}
