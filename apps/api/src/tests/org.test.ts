// apps/api/src/tests/org.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';

let token: string;

beforeAll(async () => {
  const email = `org-owner-${Date.now()}@example.com`;
  await request(app).post('/auth/register').send({ name: 'Org Owner', email, password: 'secret123' });
  const loginRes = await request(app).post('/auth/login').send({ email, password: 'secret123' });
  token = loginRes.body.data.token;
//   console.log("***************************")
//   console.log(loginRes.body)
//   console.log("***************************")
});

describe('POST /organisation', () => {
  it('creates an organisation when authenticated', async () => {
    const res = await request(app)
      .post('/organisation')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Acme Inc', description: 'A test org' });

    // console.log(res.body.data.organisation)

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.organisation).toHaveProperty('id');
  });

  it('rejects when name is missing', async () => {
    const res = await request(app)
      .post('/organisation')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Missing a name' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('rejects when description is missing', async () => {
    const res = await request(app)
      .post('/organisation')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'No Description Org' });

    expect(res.status).toBe(400);
  });

  it('rejects when not authenticated', async () => {
    const res = await request(app)
      .post('/organisation')
      .send({ name: 'No Auth Org', description: 'Should fail' });

    expect(res.status).toBe(401);
  });
});

describe('DELETE /organisation/:id', () => {
  let orgId: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/organisation')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'To Be Deleted', description: 'temp org' });
    orgId = res.body.data.id;
  });

  it('rejects delete without confirmation', async () => {
    const res = await request(app)
      .delete(`/organisation/${orgId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it('deletes the organisation when confirmed by the owner', async () => {
    const res = await request(app)
      .delete(`/organisation/${orgId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ confirmation: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('rejects deleting a non-existent organisation', async () => {
    const res = await request(app)
      .delete(`/organisation/nonexistent-id`)
      .set('Authorization', `Bearer ${token}`)
      .send({ confirmation: true });

    expect(res.status).not.toBe(200);
  });
});