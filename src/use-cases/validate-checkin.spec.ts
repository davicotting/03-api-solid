import { describe, expect, it, beforeEach, vi, afterAll } from "vitest";

import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { CheckInsRepository } from "@/repositories/checkins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "generated/prisma/runtime/library";
import { MaxNumberCheckinsError } from "./errors/max-number-of-checkins-error";
import { MaxDistanceError } from "./errors/max-distance-error";
import { ValidateCheckInUseCase } from "./validate-checkin";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { LateCheckinValidationError } from "./errors/late-checkin-validation-error";

let GymsRepository: InMemoryGymsRepository;
let CheckInsRepository: InMemoryCheckInRepository;
let sut: ValidateCheckInUseCase;

describe("CheckIn use case test", () => {
  beforeEach(() => {
    CheckInsRepository = new InMemoryCheckInRepository();
    sut = new ValidateCheckInUseCase(CheckInsRepository);
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("should validade an checkin", async () => {
    const createdCheckin = await CheckInsRepository.create({
      id: "checkin-01",
      gymId: "gym-01",
      user_id: "user-01",
    });

    const { checkIn } = await sut.execute({
      id: createdCheckin.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(CheckInsRepository.checkIns[0].user_id).toEqual(expect.any(String));
  });

  it("should be not able to validate an inexistent check-in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await expect(
      sut.execute({
        id: "not-existent-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be not able to validate an check-in of your time expires", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 40, 0));

    const createdCheckin = await CheckInsRepository.create({
      id: "checkin-01",
      gymId: "gym-01",
      user_id: "user-01",
    });

    const timeAdvancedTwentyOneMinutes = 1000 * 60 * 21;

    vi.advanceTimersByTime(timeAdvancedTwentyOneMinutes);

    await expect(sut.execute({
      id: createdCheckin.id,
    })).rejects.toBeInstanceOf(LateCheckinValidationError);
    
  });
});
