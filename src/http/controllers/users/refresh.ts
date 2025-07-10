import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(
  request: FastifyRequest,
  reply: FastifyReply
) {
  await request.jwtVerify({ onlyCookie: true });

  const { role, sub } = request.user;

  const token = await reply.jwtSign(
    {
        role,
    },
    {
      sign: {
        sub,
        expiresIn: "10m",
      },
    }
  );

  const refreshToken = await reply.jwtSign(
    { role },
    {
      sign: {
        sub,
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
}
