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
import dayjs from "dayjs";
import { LateCheckinValidationError } from "./errors/late-checkin-validation-error";

interface ValidateCheckinUseCaseRequestProps {
  id: string;
}

interface ValidateCheckinUseCaseResponseProps {
  checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
  constructor(
    private checkInRepository: CheckInsRepository,
  ) {}

  async execute({
    id
  }: ValidateCheckinUseCaseRequestProps): Promise<ValidateCheckinUseCaseResponseProps> {
    const checkIn = await this.checkInRepository.findById(id)

    if (!checkIn) {
      throw new ResourceNotFoundError();
    }

    const checkInCreationTimeInMinutes = dayjs(new Date).diff(checkIn.created_at, "minutes");

    if(checkInCreationTimeInMinutes >= 20){
      throw new LateCheckinValidationError();
    }

    checkIn.validated_at = new Date();

    await this.checkInRepository.save(checkIn);


    return {
      checkIn,
    };
  }
}