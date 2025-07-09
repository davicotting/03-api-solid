import { Prisma, User } from "generated/prisma";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "node:crypto";

export class InMemoryUserRepository implements UsersRepository {
  public users: User[] = [];

  async findById(id: string) {
    const userWithSameEmail = this.users.find((user) => user.id === id);

    if (!userWithSameEmail) {
      return null;
    }

    return userWithSameEmail;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      name: data.name,
      id: randomUUID(),
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string) {
    const userWithSameEmail = this.users.find((user) => email === user.email);

    if (!userWithSameEmail) {
      return null;
    }

    return userWithSameEmail;
  }
}
