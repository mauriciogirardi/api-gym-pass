import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InvalidCheckInError } from './error/invalid-check-in-error'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanteError } from './error/max-distance-error'

let usersRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUserCase: CheckInUseCase

describe('Check In Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUserCase = new CheckInUseCase(usersRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym Doe',
      phone: '4796089693',
      description: 'description gym',
      latitude: 40.6980168,
      longitude: -8.4732726,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUserCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.6980168,
      userLongitude: -8.4732726,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 3, 20, 8, 0, 0))

    await checkInUserCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.6980168,
      userLongitude: -8.4732726,
    })

    await expect(
      checkInUserCase.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 40.6980168,
        userLongitude: -8.4732726,
      }),
    ).rejects.toBeInstanceOf(InvalidCheckInError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 3, 20, 8, 0, 0))

    await checkInUserCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.6980168,
      userLongitude: -8.4732726,
    })

    vi.setSystemTime(new Date(2023, 3, 21, 8, 0, 0))

    const { checkIn } = await checkInUserCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 40.6980168,
      userLongitude: -8.4732726,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Gym Doe',
      phone: '4796089693',
      description: 'description gym',
      latitude: new Decimal(40.6962019),
      longitude: new Decimal(-8.4812346),
    })

    await expect(() =>
      checkInUserCase.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: 40.6980168,
        userLongitude: -8.4732726,
      }),
    ).rejects.toBeInstanceOf(MaxDistanteError)
  })
})
