import { FastifyInstance } from "fastify";
import { VerifyJWT } from "../../middlewares/verify-jwt";
import { authenticate } from "./authenticate";
import { register } from "./register";
import { profile } from "./profile";
import { refresh } from "./refresh";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/session", authenticate);

  app.patch('/token/refresh', refresh)
  /* Authenticated Routes */

  app.get("/me", { onRequest: [VerifyJWT] }, profile);
}
