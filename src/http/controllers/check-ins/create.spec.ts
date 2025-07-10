import { expect, describe, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

describe("Create Checkin (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should able to create a checkin", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const createdGym = await prisma.gym.create({
      data: {
        name: "Gym Name",
        description: "description",
        phone: "88483936",
        latitude: -3.8679496,
        longitude: -38.6277535,
        title: "Gym Title",
      },
    });

    const createCheckinResponse = await request(app.server)
      .post(`/gyms/${createdGym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -3.8679496,
        longitude: -38.6277535,
      });
      
    expect(createCheckinResponse.statusCode).toEqual(201);
  });
});
