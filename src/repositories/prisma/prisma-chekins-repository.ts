import { Prisma, CheckIn } from "generated/prisma";
import { CheckInsRepository } from "../checkins-repository";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";

export class PrismaCheckinsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkin = await prisma.checkIn.create({
      data,
    });

    return checkin;
  }
  async findbyUserIdOnDate(user_id: string, date: Date) {
    const starOfDay = dayjs(date).startOf("date");
    const endOfDay = dayjs(date).endOf("date");

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id,
        created_at: {
          gte: starOfDay.toDate(),
          lte: endOfDay.toDate(),
        },
      },
    });

    return checkIn;
  }
  async findManyByUserId(user_id: string, page: number) {
    const chekins = await prisma.checkIn.findMany({
      where: {
        user_id: user_id,
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return chekins;
  }
  async countByUserId(user_id: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id,
      },
    });

    return count;
  }
  async findById(id: string) {
    const checkin = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    });

    return checkin;
  }
  async save(checkin: CheckIn) {
    const checkinToSave = await prisma.checkIn.update({
      where: {
        id: checkin.id,
      },
      data: checkin,
    });
    return checkinToSave;
  }
}
