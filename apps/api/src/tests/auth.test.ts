// apps/api/src/tests/auth.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import { prisma } from "@repo/db";

describe("Auth endpoints", () => {
  beforeEach(async () => {
    // clean slate between tests
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
  });

  it("registers a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123", name: "Test User" });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.user.password).toBeUndefined(); // never leak password
  });

  it("rejects duplicate email on register", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "dupe@example.com", password: "password123", name: "A" });

    const res = await request(app)
      .post("/auth/register")
      .send({ email: "dupe@example.com", password: "password123", name: "B" });

    expect(res.status).not.toBe(201);
  });

  it("logs in with correct credentials and returns tokens", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "login@example.com", password: "password123", name: "Login User" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "login@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "wrongpass@example.com", password: "password123", name: "User" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "wrongpass@example.com", password: "wrongpassword" });

    expect(res.status).toBe(401);
  });

  it("refreshes access token with valid refresh token", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "refresh@example.com", password: "password123", name: "User" });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "refresh@example.com", password: "password123" });

    const res = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: loginRes.body.refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("logs out and revokes the refresh token", async () => {
    await request(app)
      .post("/auth/register")
      .send({ email: "logout@example.com", password: "password123", name: "User" });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "logout@example.com", password: "password123" });

    await request(app)
      .post("/auth/logout")
      .send({ refreshToken: loginRes.body.refreshToken });

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: loginRes.body.refreshToken });

    expect(refreshRes.status).not.toBe(200); // revoked, should fail now
  });
});