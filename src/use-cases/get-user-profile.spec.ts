import { describe, expect, it, beforeEach } from "vitest";
import { hash } from "bcrypt";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { getUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found";
import { rejects } from "assert";

let inMemoryUserRepository: InMemoryUserRepository;
let sut: getUserProfileUseCase;

describe("Authenticate use case test", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new getUserProfileUseCase(inMemoryUserRepository);
  });

  it("should get user", async () => {
    const email = "johnDoe@gmail.com";
    const password = "123456";

    const createdUser = await inMemoryUserRepository.create({
      email,
      password_hash: await hash(password, 6),
      name: "John Doe",
    });

    const { user } = await sut.execute({
      id: createdUser.id,
    });

    expect(user.email).toEqual(expect.any(String));
  });

  it("should not get an user with a wrong id", async () => {
    await expect(sut.execute({ id: "not-existing-id" })).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
  });
});
