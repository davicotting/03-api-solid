import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcrypt";
import { UserAlreadyExistsError } from "./errors/user-aready-exists-error";
import { User } from "generated/prisma";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

interface RegisterUserUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserProps): Promise<RegisterUserUseCaseResponse> {

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    });

    return {
      user,
    };
  }
}
