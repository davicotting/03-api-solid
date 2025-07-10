import fastify from "fastify";
import { usersRoutes } from "./http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import { gymRoutes } from "./http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import fastifyCookie from "@fastify/cookie";

export const app = fastify();

app.register(usersRoutes);
app.register(gymRoutes);
app.register(checkInsRoutes);

app.register(fastifyCookie);

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: "10m",
  },
  cookie: {
    cookieName: "refreshToken",
    signed: false,
  },
});

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply
      .code(400)
      .send({ message: "Validation error", issue: error.format() });
  } else {
    // todo: fazer o log com ferramentas externas como um datadog...
  }

  if (env.NODE_ENV != "production") {
    console.error(error);
  }

  return reply.code(500).send({ message: "Internal server error." });
});
