import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { FetchCheckInUseCase } from "./fetch-user-check-ins";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let inMemoryCheckInRepository: InMemoryCheckInRepository;
let sut: GetUserMetricsUseCase;

describe("Create Gym use case test", () => {
  beforeEach(() => {
    inMemoryCheckInRepository = new InMemoryCheckInRepository();
    sut = new GetUserMetricsUseCase(inMemoryCheckInRepository);
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

    const { checkinsCount } = await sut.execute({ userId: "user-01" });

    console.log(checkinsCount);

    expect(checkinsCount).toEqual(2);
  });
});
