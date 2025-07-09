import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcrypt";
import { UserAlreadyExistsError } from "./errors/user-aready-exists-error";
import { Gym, User } from "generated/prisma";
import { GymsRepository } from "@/repositories/gyms-repository";

interface CreateGymUseCaseProps {
  name: string;
  title: string;
  description: string | null;
  phone: string | null;
  latitude: number;
  longitude: number;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    name,
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseProps): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      name,
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}
