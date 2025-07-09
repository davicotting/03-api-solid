import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { FetchCheckInUseCase } from "./fetch-user-check-ins";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearbygyms  use case", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(inMemoryGymsRepository);
  });

  it("Should be able to fetch nearby gyms", async () => {
    await inMemoryGymsRepository.create({
      name: "Nearby Gym",
      description: null,
      phone: null,
      latitude: -3.8679496,
      longitude: -3.8679496,
      title: "Nearby Gym",
    });

    await inMemoryGymsRepository.create({
      name: "Far Gym",
      description: null,
      phone: null,
      latitude: -200,
      longitude: -200,
      title: "Nearby Gym",
    });

    const query = await inMemoryGymsRepository.findManyNearby({
        latitude: -3.8679496,
        longitude: -3.8679496
    });

    expect(query).toHaveLength(1);
    expect(query).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Nearby Gym" }),
      ])
    );
  });

});
