import { FastifyInstance } from "fastify";
import { VerifyJWT } from "../../middlewares/verify-jwt";
import { nearby } from "./nearby";
import { search } from "./search";
import { create } from "./create";
import { roleToVerify } from "@/http/middlewares/verify-user-role";

export async function gymRoutes(app: FastifyInstance) {
  app.addHook("onRequest", VerifyJWT);

  app.get("/gyms/nearby", nearby);
  app.get("/gyms/search", search);

  app.post("/gyms", { onRequest: [roleToVerify("ADMIN")] }, create);
}
