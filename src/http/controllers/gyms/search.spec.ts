import { expect, describe, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search Gyms (E2E)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should able to search gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "typescript gym",
        description: "description",
        phone: "88483936",
        latitude: -3.8679496,
        longitude: -38.6277535,
        title: "typescript gym",
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "javascript gym",
        description: "description",
        phone: "88483936",
        latitude: -3.8679496,
        longitude: -38.6277535,
        title: "javascript gym",
      });

    const response = await request(app.server)
      .get("/gyms/search")
      .query({ query: "t" })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(2);
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "javascript gym",
        }),
        expect.objectContaining({
          title: "typescript gym",
        }),
      ])
    );
  });
});
