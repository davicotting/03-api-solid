import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcrypt";
import { UserAlreadyExistsError } from "./errors/user-aready-exists-error";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async createUserUseCase({ name, email, password }: CreateUserProps) {

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError;
    }

    const password_hash = await hash(password, 6);

    this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
