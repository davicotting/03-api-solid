import { describe, expect, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcrypt";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-aready-exists-error";

let inMemoryUserRepository: InMemoryUserRepository;
let sut: RegisterUseCase;

describe("Register use case test", () => {

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new RegisterUseCase(inMemoryUserRepository)
  })

  it("should create an user", async () => {
    const email = "johndoe@gmail.com";

    const { user } = await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    expect(user.email).toEqual(expect.any(String));
  });

  it("be hashing a user password upon an registration", async () => {

    const email = "johndoe@gmail.com";

    const { user } = await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    const isHashedPassword = await compare("123456", user.password_hash);

    expect(isHashedPassword).toBe(true);
  });

  it("should reject a creation of a user with the same email", async () => {
   
    const email = "johndoe@gmail.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(() =>
      sut.execute({
        name: "John Doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
