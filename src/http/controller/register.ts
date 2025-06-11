import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-aready-exists-error";
import { RegisterUseCase } from "@/use-cases/register";
import { FastifyReply, FastifyRequest } from "fastify";
import * as zod from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const { name, email, password } = requestBodySchema.parse(request.body);

  try {
    const registerUseCase = new RegisterUseCase(new PrismaUsersRepository)
    await registerUseCase.createUserUseCase({ name, email, password });
  } catch (error) {
    if(error instanceof UserAlreadyExistsError){
      return reply.code(409).send(error.message);
    }
    return error
  }

  return reply.code(201).send({ message: "usuario criado com sucesso!" });
}
