import { PrismaCheckinsRepository } from "@/repositories/prisma/prisma-chekins-repository";
import { ValidateCheckInUseCase } from "../validate-checkin";

export function makeValidateCheckinUseCase() {
  const checkInsRepository = new PrismaCheckinsRepository();
  const useCase = new ValidateCheckInUseCase(checkInsRepository);

  return useCase;
}
