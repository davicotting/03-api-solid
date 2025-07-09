import { CheckIn } from "generated/prisma";
import { CheckInsRepository } from "@/repositories/checkins-repository";

interface FetchUserCheckInsHistoryRequestProps {
  userId: string;
  page: number;
}

interface FetchUserCheckInsHistoryResponseProps {
  checkIns: CheckIn[];
}

export class FetchCheckInUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryRequestProps): Promise<FetchUserCheckInsHistoryResponseProps> {
    const checkIns = (
      await this.checkInRepository.findManyByUserId(userId, page)
    ).slice((page - 1) * 20, page * 20);

    return {
      checkIns,
    };
  }
}
