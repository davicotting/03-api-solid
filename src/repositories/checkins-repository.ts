import { CheckIn, Prisma } from "generated/prisma";

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>;
  findbyUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
  findManyByUserId(user_id: string, page: number): Promise<CheckIn[]>;
  countByUserId(user_id: string): Promise<number>
  findById(id: string): Promise<CheckIn | null>;
  save(checkin: CheckIn): Promise<CheckIn>
}
