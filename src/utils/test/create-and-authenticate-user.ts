import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import request from "supertest";
import { hash } from "bcrypt";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  await prisma.user.create({
    data: {
      name: "john doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
      role: isAdmin == true ? "ADMIN" : "MEMBER",
    },
  });

  const login = await request(app.server).post("/session").send({
    email: "johndoe@example.com",
    password: "123456",
  });

  const { token } = login.body;

  return {
    token,
  };
}
