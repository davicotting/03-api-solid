import { Prisma, Gym } from "generated/prisma";
import { randomUUID } from "node:crypto";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates-in-kilometers";
import { Decimal } from "generated/prisma/runtime/library";

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = [];

  async findManyNearby(params: FindManyNearbyParams) {
    return this.gyms.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        }
      );
      return distance < 10;
    });
  }

  async findMany(query: string, page: number) {
    const queryResult = this.gyms
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20);

    return queryResult;
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    };

    this.gyms.push(gym);

    return gym;
  }

  async findById(id: string) {
    const gymWithSameId = this.gyms.find((gym) => gym.id === id);

    if (!gymWithSameId) {
      return null;
    }

    return gymWithSameId;
  }
}
