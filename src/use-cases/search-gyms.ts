import { CheckIn, Gym } from "generated/prisma";
import { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymsUseCaseRequestProps {
  query: string;
  page: number;
}

interface SearchGymsUseCaseResponseProps {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  constructor(private GymsInRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseRequestProps): Promise<SearchGymsUseCaseResponseProps> {
    const gyms = await this.GymsInRepository.findMany(query, page);

    return {
      gyms,
    };
  }
}
