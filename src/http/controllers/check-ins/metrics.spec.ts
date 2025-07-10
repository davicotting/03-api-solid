import { expect, describe, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Checkins Metrics (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should able to have a total count of checkins", async () => {
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

    const metricsCheckinResponse = await request(app.server)
      .get(`/check-ins/metrics`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(metricsCheckinResponse.statusCode).toEqual(200);
    expect(metricsCheckinResponse.body.checkinsCount).toEqual(2);
  });
});
