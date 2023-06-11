import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let searchGyms: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    searchGyms = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search by title', async () => {
    await gymsRepository.create({
      title: 'Gym',
      description: 'description',
      phone: '4479636265',
      latitude: 40.6980168,
      longitude: -8.4732726,
    })

    await gymsRepository.create({
      title: 'Javascript Gym',
      description: 'description',
      phone: '4479636265',
      latitude: 40.6980168,
      longitude: -8.4732726,
    })

    await gymsRepository.create({
      title: 'Fitness',
      description: 'description',
      phone: '4479636265',
      latitude: 40.6980168,
      longitude: -8.4732726,
    })

    const { gyms } = await searchGyms.execute({ query: 'Gym', page: 1 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Gym' }),
      expect.objectContaining({ title: 'Javascript Gym' }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Gym-${i}`,
        description: 'description',
        phone: '4479636265',
        latitude: 40.6980168,
        longitude: -8.4732726,
      })
    }

    const { gyms } = await searchGyms.execute({ query: 'Gym', page: 2 })
    const searchGym = await searchGyms.execute({ query: '5', page: 2 })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: `Gym-21` }),
      expect.objectContaining({ title: `Gym-22` }),
    ])
    expect(searchGym.gyms).toEqual([])
  })
})
