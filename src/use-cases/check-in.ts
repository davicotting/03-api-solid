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

interface CheckinUseCaseRequestProps {
  userId: string;
  gym_id: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckinUseCaseResponseProps {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    gym_id,
    userId,
    userLatitude,
    userLongitude,
  }: CheckinUseCaseRequestProps): Promise<CheckinUseCaseResponseProps> {
    const gym = await this.gymsRepository.findById(gym_id);

    if (!gym) {
      throw new ResourceNotFoundError();
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() }
    );

    const MAX_DISTANCE_IN_KILOMETERS = 0.1; // 100 metros

    if(distance > MAX_DISTANCE_IN_KILOMETERS){
        throw new MaxDistanceError();
    }

    const checkinInSameDate = await this.checkInRepository.findbyUserIdOnDate(
      userId,
      new Date()
    );

    if (checkinInSameDate) {
      throw new MaxNumberCheckinsError();
    }

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gymId: gym_id,
    });

    return {
      checkIn,
    };
  }
}
