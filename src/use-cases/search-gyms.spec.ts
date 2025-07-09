import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-checkins-repository";
import { FetchCheckInUseCase } from "./fetch-user-check-ins";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe("Create Gym use case test", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(inMemoryGymsRepository);
  });

  it("should be able check-in historty", async () => {
    await inMemoryGymsRepository.create({
      name: "name 1",
      description: null,
      phone: null,
      latitude: -3.8679496,
      longitude: -38.6277535,
      title: "javascript gym",
    });

    await inMemoryGymsRepository.create({
      name: "name 2",
      description: null,
      phone: null,
      latitude: -3.8679496,
      longitude: -38.6277535,
      title: "typescript gym",
    });

    const query = await inMemoryGymsRepository.findMany("typescript", 1);

    expect(query).toHaveLength(1);
    expect(query).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "typescript gym" }),
      ])
    );
  });
  it("should be create a pagination of gyms ", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        name: "",
        description: null,
        phone: null,
        latitude: -3.8679496,
        longitude: -38.6277535,
        title: `gym title ${i}`,
      });
    }
    const { gyms } = await sut.execute({
      page: 2,
      query: "gym",
    });

    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "gym title 21" }),
        expect.objectContaining({ title: "gym title 22" }),
      ])
    );
  });
});
