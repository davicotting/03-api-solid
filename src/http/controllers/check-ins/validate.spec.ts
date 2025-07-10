import { expect, describe, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Validate Checkin (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("it should able to validate checkin", async () => {
    const { token } = await createAndAuthenticateUser(app, true);
    const user = await prisma.user.findFirstOrThrow();

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

    let checkIn = await prisma.checkIn.create({
      data: {
        user_id: user.id,
        gymId: createdGym.id,
      },
    });

    const validateCheckinResponse = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -3.8679496,
        longitude: -38.6277535,
      });

    expect(validateCheckinResponse.statusCode).toEqual(204);

    checkIn = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkIn.id,
      },
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date))
  });
});
