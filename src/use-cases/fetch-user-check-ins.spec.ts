import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { FetchCheckInUseCase } from "./fetch-user-check-ins";

let inMemoryCheckInRepository: InMemoryCheckInRepository;
let sut: FetchCheckInUseCase;

describe("Create Gym use case test", () => {
  beforeEach(() => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository();
    sut = new FetchCheckInUseCase(inMemoryCheckInRepository);
  });

  it("should be able check-in historty", async () => {
    await inMemoryCheckInRepository.create({
      gymId: "gym-01",
      user_id: "user-01",
    });

    await inMemoryCheckInRepository.create({
      gymId: "gym-02",
      user_id: "user-01",
    });

    const { checkIns } = await sut.execute({
      userId: "user-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ gymId: "gym-01" }),
        expect.objectContaining({ gymId: "gym-02" }),
      ])
    );
  });
  it("should be create a pagination of checkin history", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCheckInRepository.create({
        gymId: `gym-${i}`,
        user_id: "user-01",
      });
    }
    const { checkIns } = await sut.execute({
      page: 2,
      userId: "user-01",
    });

    expect(checkIns).toHaveLength(2);
  });
});
