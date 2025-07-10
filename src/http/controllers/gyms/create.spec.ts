import { expect, describe, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Gym (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should able to create a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const profileResponse = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gym Name",
        description: 'description',
        phone: '88483936',
        latitude: -3.8679496,
        longitude: -38.6277535,
        title: "Gym Title",
      });

    expect(profileResponse.statusCode).toEqual(201);
  });
});
