import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app";

let token: string;
let organisationId: string;

beforeAll(async () => {
  const email = `board-owner-${Date.now()}@example.com`;

  await request(app)
    .post("/auth/register")
    .send({ name: "Board Owner", email, password: "secret123" });

  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email, password: "secret123" });

  token = loginRes.body.data.token;

  const orgRes = await request(app)
    .post("/organisation")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: `Board Org ${Date.now()}`, description: "test org" });

  organisationId = orgRes.body.data.organisation.id;
});

describe("POST /:organisationId/board", () => {
  it("creates a board when authenticated", async () => {
    const res = await request(app)
      .post(`/${organisationId}/board`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Sprint Board" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.board).toHaveProperty("id");
  });

  it("rejects when title is missing", async () => {
    const res = await request(app)
      .post(`/${organisationId}/board`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
