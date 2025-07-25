import { Prisma, User } from "generated/prisma";

export interface UsersRepository {
    findById(id: string): Promise<User | null> 
    create(data: Prisma.UserCreateInput): Promise<User>;
    findByEmail(email: string): Promise<User | null>
}