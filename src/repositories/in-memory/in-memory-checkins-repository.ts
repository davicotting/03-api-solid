import { CheckIn, Prisma } from "generated/prisma";
import { CheckInsRepository } from "../checkins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InMemoryCheckInRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = [];

  async save(checkin_to_save: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (checkIn) => checkIn.id == checkin_to_save.id
    );

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkin_to_save;
    }

    return checkin_to_save;
  }

  async findById(id: string) {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id == id);

    if (!checkIn) {
      return null;
    }

    return checkIn;
  }

  async findManyByUserId(userd_id: string) {
    return this.checkIns.filter((checkin) => checkin.user_id == userd_id);
  }

  async countByUserId(user_id: string) {
    const totalOfCheckinsCount = this.checkIns.filter(
      (checkIn) => checkIn.user_id == user_id
    ).length;
    return totalOfCheckinsCount;
  }

  async findbyUserIdOnDate(userId: string, date: Date) {
    const starOfDay = dayjs(date).startOf("date");
    const endOfDay = dayjs(date).endOf("date");
    const checkinInSameDate = this.checkIns.find((checkIn) => {
      const dateOfCheckIn = dayjs(checkIn.created_at);

      const isOnSameDate =
        dateOfCheckIn.isBefore(endOfDay) && dateOfCheckIn.isAfter(starOfDay);

      if (!isOnSameDate) {
        return null;
      }

      return checkIn.user_id == userId && isOnSameDate;
    });

    if (!checkinInSameDate) {
      return null;
    }

    return checkinInSameDate;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      gymId: data.gymId,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }
}
