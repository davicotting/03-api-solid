import { prisma } from "@/lib/prisma";
import { Prisma, User } from "generated/prisma";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string) {
    const userWithSameId = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return userWithSameId;
  }
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findByEmail(email: string) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return userWithSameEmail;
  }
}
