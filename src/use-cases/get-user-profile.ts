import { UsersRepository } from "@/repositories/users-repository";
import { User } from "generated/prisma";
import { ResourceNotFoundError } from "./errors/resource-not-found";

interface getUserProfileUseCaseRequestProps {
    id: string
}

interface getUserProfileUseCaseResponseProps {
   user: User
}

export class getUserProfileUseCase {
    constructor(private usersRepository: UsersRepository){}

    async execute({ id }: getUserProfileUseCaseRequestProps): Promise<getUserProfileUseCaseResponseProps>{
        const user = await this.usersRepository.findById(id);

        if(!user){
            throw new ResourceNotFoundError();
        }

        return {
            user
        }
    }
}