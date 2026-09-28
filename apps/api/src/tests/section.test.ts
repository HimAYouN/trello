import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app";

let token: string;
let boardId: string;
let sectionId: string;

describe("Section API", () => {
  beforeAll(async () => {
    const email = `section-user-${Date.now()}@example.com`;

    await request(app)
      .post("/auth/register")
      .send({ name: "Section User", email, password: "secret123" });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password: "secret123" });

    token = loginRes.body.data.token;

    const orgRes = await request(app)
      .post("/organisation")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: `Section Org ${Date.now()}`, description: "section org" });

    const organisationId = orgRes.body.data.organisation.id;

    const boardRes = await request(app)
      .post(`/${organisationId}/board`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Section Board" });

    boardId = boardRes.body.data.board.id;
  });

  it("creates a section in a board", async () => {
    const res = await request(app)
      .post(`/${boardId}/section`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Todo" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.section).toHaveProperty("id");
    expect(res.body.data.section.title).toBe("Todo");

    sectionId = res.body.data.section.id;
  });

  it("lists all sections for a board", async () => {
    const res = await request(app)
      .get(`/${boardId}/section`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.sections)).toBe(true);
    expect(res.body.data.sections.some((item: any) => item.id === sectionId)).toBe(true);
  });

  it("rejects section creation when title is missing", async () => {
    const res = await request(app)
      .post(`/${boardId}/section`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("deletes a section by id", async () => {
    const res = await request(app)
      .delete(`/section/${sectionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.section.id).toBe(sectionId);
  });
});
