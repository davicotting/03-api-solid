import { Gym } from "generated/prisma";
import { GymsRepository } from "@/repositories/gyms-repository";

interface FetchNearbyGymsUseCaseRequestProps {
    userLatitude: number;
    userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponseProps {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  constructor(private GymsInRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude
  }: FetchNearbyGymsUseCaseRequestProps): Promise<FetchNearbyGymsUseCaseResponseProps> {
    const gyms = await this.GymsInRepository.findManyNearby({
        latitude: userLatitude,
        longitude: userLongitude
    })

    return {
      gyms,
    };
  }
}
