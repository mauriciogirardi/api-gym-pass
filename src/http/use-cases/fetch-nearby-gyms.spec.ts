import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGyms: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGyms = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'description',
      phone: '4479636265',
      latitude: 40.6980168,
      longitude: -8.4732726,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'description',
      phone: '4479636265',
      latitude: 12.6980256,
      longitude: -8.4732726,
    })

    const { gyms } = await fetchNearbyGyms.execute({
      userLatitude: 40.6980168,
      userLongitude: -8.4732726,
    })

    expect(gyms).toHaveLength(1)
  })
})
