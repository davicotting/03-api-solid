import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import * as zod from "zod";

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const requestBodySchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
  });

  const { email, password } = requestBodySchema.parse(request.body);

  try {
    const authUseCase = makeAuthenticateUseCase();
    const { user } = await authUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "10m",
        },
      }
    );

    const refreshToken = await reply.jwtSign(
      {
        role: user.role
      },
      {
        sign: {
          sub: user.id,
          expiresIn: "7d",
        },
      }
    );

    return reply
      .code(200)
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.code(400).send(error.message);
    }
    return error;
  }
}
