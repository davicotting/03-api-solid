import { PrismaCheckinsRepository } from "@/repositories/prisma/prisma-chekins-repository";
import { FetchCheckInUseCase } from "../fetch-user-check-ins";

export function makeFetchCheckinsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckinsRepository();
  const useCase = new FetchCheckInUseCase(checkInsRepository);

  return useCase;
}
