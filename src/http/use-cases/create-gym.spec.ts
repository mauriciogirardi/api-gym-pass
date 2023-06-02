import { describe, expect, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a gyn', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Gym',
      description: 'description',
      phone: '4479636265',
      latitude: 40.6980168,
      longitude: -8.4732726,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
