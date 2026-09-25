import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app";

let token: string;
let email: string;

describe("GET /me", () => {
  beforeAll(async () => {
    email = `user-${Date.now()}@example.com`;

    await request(app)
      .post("/auth/register")
      .send({ name: "User Profile", email, password: "secret123" });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password: "secret123" });

    token = loginRes.body.data.token;
  });

  it("returns the authenticated user profile", async () => {
    const res = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toHaveProperty("id");
    expect(res.body.data.user.email).toBe(email);
  });

  it("rejects requests without authentication", async () => {
    const res = await request(app).get("/me");

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
