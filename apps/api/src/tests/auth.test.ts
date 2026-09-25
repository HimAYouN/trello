// apps/api/tests/auth.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../app";
import { prisma } from "@repo/db";

beforeAll(async () => {
  // await prisma.user.deleteMany(); // clean slate
});

afterAll(async () => {
  await prisma.$disconnect();
});



const email = `jane${Math.random() * 100}@example.com`;
const name = `jane${Math.random() * 100} Doe`;
describe('POST /auth/register', () => {
  it('creates a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name, email, password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(email);
  });

  it('rejects a duplicate email', async () => {
    await request(app).post('/auth/register').send({ name: 'A', email: 'dup@example.com', password: 'secret123' });
    const res = await request(app).post('/auth/register').send({ name: 'B', email: 'dup@example.com', password: 'secret123' });
    expect(res.status).not.toBe(200);
  });
});

describe('POST /auth/login', () => {
  it('logs in with correct credentials and returns a token', async () => {
    await request(app).post('/auth/register').send({ name: 'Jane', email: 'jane@example.com', password: 'secret123' });
    const res = await request(app).post('/auth/login').send({ email: 'jane@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});