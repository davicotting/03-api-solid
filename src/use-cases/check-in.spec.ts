import { describe, expect, it, beforeEach, vi, afterAll } from "vitest";

import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { CheckInsRepository } from "@/repositories/checkins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "generated/prisma/runtime/library";
import { MaxNumberCheckinsError } from "./errors/max-number-of-checkins-error";
import { MaxDistanceError } from "./errors/max-distance-error";

let GymsRepository: InMemoryGymsRepository;
let CheckInsRepository: InMemoryCheckInRepository;
let sut: CheckInUseCase;

describe("CheckIn use case test", () => {
  beforeEach(() => {
    CheckInsRepository = new InMemoryCheckInRepository();
    GymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(CheckInsRepository, GymsRepository);
    vi.useFakeTimers();

    GymsRepository.create({
      name: "JavaScript Gym",
      title: "titulo",
      description: null,
      id: "gym_01",
      phone: null,
      latitude: -3.8679496,
      longitude: -38.6277535,
    });
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("should make a check in", async () => {
    const { checkIn } = await sut.execute({
      gym_id: "gym_01",
      userId: "user_01",
      userLatitude: -3.8679496,
      userLongitude: -38.6277535,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not to be able to make a check in two times in the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gym_id: "gym_01",
      userId: "user_01",
      userLatitude: -3.8679496,
      userLongitude: -38.6277535,
    });

    await expect(
      sut.execute({
        gym_id: "gym_01",
        userId: "user_01",
        userLatitude: -3.8679496,
        userLongitude: -38.6277535,
      })
    ).rejects.toBeInstanceOf(MaxNumberCheckinsError);
  });

  it("should user not able to checkin if distant", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await expect(
      sut.execute({
        gym_id: "gym_01",
        userId: "user_01",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
