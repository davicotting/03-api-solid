import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcrypt";
import { CheckIn, User } from "generated/prisma";
import { CheckInsRepository } from "@/repositories/checkins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates-in-kilometers";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberCheckinsError } from "./errors/max-number-of-checkins-error";

interface GetUserMetricsUseCaseRequestProps {
  userId: string;
}

interface GetUserMetricsUseCaseResponseProps {
  checkinsCount: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequestProps): Promise<GetUserMetricsUseCaseResponseProps> {
    const checkinsCount = await this.checkInRepository.countByUserId(userId);

    return {
      checkinsCount,
    };
  }
}
