import { UserAlreadyExistsError } from "@/use-cases/errors/user-aready-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
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
    const registerUseCase = makeRegisterUseCase();
    await registerUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.code(409).send(error.message);
    }
    return error;
  }

  return reply.code(201).send({ message: "usuario criado com sucesso!" });
}
