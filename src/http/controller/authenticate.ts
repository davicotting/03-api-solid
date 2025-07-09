import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import * as zod from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const requestBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const { email, password } = requestBodySchema.parse(request.body);

  try {
    const authUseCase = makeAuthenticateUseCase();
    const { user } = await authUseCase.execute({ email, password });

    const token = await reply.jwtSign({}, {
      sign: {
        sub: user.id
      }
    })

    return reply.code(200).send({ token });

  } catch (error) {
    if(error instanceof InvalidCredentialsError){
      return reply.code(400).send(error.message);
    }
    return error
  }

  
}
