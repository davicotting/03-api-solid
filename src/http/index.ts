import { FastifyInstance } from "fastify";
import { register } from "./controller/register";
import { authenticate } from "./controller/authenticate";
import { profile } from "./controller/profile";
import { VerifyJWT } from "./middlewares/verify-jwt";

export async function routes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/session", authenticate);

  app.post("/authenticate", authenticate);

  /* Authenticated Routes */

  app.get("/me", { onRequest: [VerifyJWT] }, profile);
}
