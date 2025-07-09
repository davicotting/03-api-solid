
import { GetUserMetricsUseCase } from "../get-user-metrics";
import { PrismaCheckinsRepository } from "@/repositories/prisma/prisma-chekins-repository";

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrismaCheckinsRepository();
  const useCase = new GetUserMetricsUseCase(checkInsRepository);

  return useCase;
}
