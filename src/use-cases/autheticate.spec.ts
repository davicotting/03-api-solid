import { describe, expect, it, beforeEach } from "vitest";
import { hash } from "bcrypt";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";


let inMemoryUserRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe("Authenticate use case test", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(inMemoryUserRepository);
  });

  it("should authenticate an created user", async () => {
    const email = "johnDoe@gmail.com";
    const password = "123456";

    inMemoryUserRepository.create({
      email,
      password_hash: await hash(password, 6),
      name: "John Doe",
    });

    const { user } = await sut.execute({
      email,
      password,
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not able to authenmticate an user with an wrong email", async () => {
    const email = "johnDoe@gmail.com";
    const password = "123456";

    inMemoryUserRepository.create({
      email,
      password_hash: await hash(password, 6),
      name: "John Doe",
    });

    const wrongEmail = "joh@gmail.com";

    await expect(() =>
      sut.execute({
        email: wrongEmail,
        password: password,
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
