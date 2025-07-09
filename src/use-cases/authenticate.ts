import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcrypt";
import { User } from "generated/prisma";

interface AuthenticateUseCaseRequestProps {
    email: string;
    password: string;
}

interface AuthenticateResponseProps {
   user: User
}

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository){}

    async execute({ email, password }: AuthenticateUseCaseRequestProps): Promise<AuthenticateResponseProps>{
        const user = await this.usersRepository.findByEmail(email);

        if(!user){
            throw new InvalidCredentialsError();
        }

        const isPasswordMatching = await compare(password, user.password_hash);

        if(!isPasswordMatching){
            throw new InvalidCredentialsError();
        }

        return {
            user
        }
    }
}