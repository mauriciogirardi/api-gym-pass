import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create({
    email,
    name,
    password_hash,
    created_at,
  }: Prisma.UserCreateInput): Promise<User> {
    const user = {
      id: randomUUID(),
      email,
      name,
      password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((user) => user.email === email) || null
    return user
  }

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((user) => user.id === id) || null
    return user
  }
}
