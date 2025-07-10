import { expect, describe, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Checkins History (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should able to list the history of checkins", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        name: "Gym Name",
        description: "description",
        phone: "88483936",
        latitude: -3.8679496,
        longitude: -38.6277535,
        title: "Gym Title",
      },
    });

    await prisma.checkIn.createMany({
      data: [
        {
          gymId: gym.id,
          user_id: user.id,
        },
        {
          gymId: gym.id,
          user_id: user.id,
        },
      ],
    });

    const historyCheckinResponse = await request(app.server)
      .get(`/check-ins/history`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(historyCheckinResponse.statusCode).toEqual(200);
    expect(historyCheckinResponse.body.checkIns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gymId: gym.id,
          user_id: user.id,
        }),
        expect.objectContaining({
          gymId: gym.id,
          user_id: user.id,
        }),
      ])
    );
  });
});
