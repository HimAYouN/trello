import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../app";

let token: string;
let sectionId: string;
let issueId: string;

describe("Issue API", () => {
  beforeAll(async () => {
    const email = `issue-user-${Date.now()}@example.com`;

    await request(app)
      .post("/auth/register")
      .send({ name: "Issue User", email, password: "secret123" });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password: "secret123" });

    token = loginRes.body.data.token;

    const orgRes = await request(app)
      .post("/organisation")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: `Issue Org ${Date.now()}`, description: "issue org" });

    const organisationId = orgRes.body.data.organisation.id;

    const boardRes = await request(app)
      .post(`/${organisationId}/board`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Issue Board" });

    const boardId = boardRes.body.data.board.id;

    const sectionRes = await request(app)
      .post(`/${boardId}/section`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Issues" });

    sectionId = sectionRes.body.data.section.id;
  });

  it("creates an issue in a section", async () => {
    const res = await request(app)
      .post(`/${sectionId}/issue`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Fix auth bug", desc: "Investigate login issue" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.issue).toHaveProperty("id");
    expect(res.body.data.issue.title).toBe("Fix auth bug");

    issueId = res.body.data.issue.id;
  });

  it("fetches all issues for a section", async () => {
    const res = await request(app)
      .get(`/${sectionId}/issues`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.issues)).toBe(true);
    expect(res.body.data.issues.some((item: any) => item.id === issueId)).toBe(true);
  });

  it("fetches a single issue by id", async () => {
    const res = await request(app)
      .get(`/issue/${issueId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.issue.id).toBe(issueId);
  });

  it("deletes an issue by id", async () => {
    const res = await request(app)
      .delete(`/issue/${issueId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.issue.id).toBe(issueId);
  });
});
