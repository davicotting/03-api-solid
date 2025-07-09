import { describe, expect, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let inMemoryGymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym use case test", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(inMemoryGymsRepository);
  });

  it("should create an gym", async () => {
    const { gym } = await sut.execute({
      name: "Gym Name",
      description: null,
      phone: null,
      latitude: -3.8679496,
      longitude: -38.6277535,
      title: "Gym Title",
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
