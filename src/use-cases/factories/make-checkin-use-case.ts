import { PrismaCheckinsRepository } from "@/repositories/prisma/prisma-chekins-repository";
import { CheckInUseCase } from "../check-in";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeCheckinUseCase() {
  const checkInsRepository = new PrismaCheckinsRepository();
  const gymsRepository = new PrismaGymsRepository();
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository);

  return useCase;
}
