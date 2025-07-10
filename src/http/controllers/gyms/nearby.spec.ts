import { expect, describe, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby Gyms (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should able to search nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Nearby Gym",
        description: null,
        phone: null,
        latitude: -3.8679496,
        longitude: -3.8679496,
        title: "Nearby Gym",
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Far Gym",
        description: null,
        phone: null,
        latitude: 200,
        longitude: 200,
        title: "Far Gym",
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({ latitude: -3.8679496, longitude: -3.8679496 })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Nearby Gym",
        }),
      ])
    );
  });
});
