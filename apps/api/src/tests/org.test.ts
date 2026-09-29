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

describe('GET /organisation', () => {
  it('returns organisations created by the authenticated user', async () => {
    const created = await request(app)
      .post('/organisation')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'List Org', description: 'Listed org' });

    const res = await request(app)
      .get('/organisation')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: created.body.data.id, name: 'List Org' }),
    ]));
  });

  it('rejects requests without authentication', async () => {
    const res = await request(app).get('/organisation');

    expect(res.status).toBe(401);
  });
});

describe('GET /organisation/:id', () => {
  it('returns an organisation created by the authenticated user', async () => {
    const created = await request(app)
      .post('/organisation')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Detail Org', description: 'Org details' });

    const res = await request(app)
      .get(`/organisation/${created.body.data.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      id: created.body.data.id,
      name: 'Detail Org',
      description: 'Org details',
    });
  });

  it('returns not found for an organisation that does not exist or belong to the user', async () => {
    const res = await request(app)
      .get('/organisation/nonexistent-id')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('does not reveal an organisation owned by another user', async () => {
    const email = `other-org-owner-${Date.now()}@example.com`;
    await request(app).post('/auth/register').send({ name: 'Other Owner', email, password: 'secret123' });
    const loginRes = await request(app).post('/auth/login').send({ email, password: 'secret123' });
    const otherToken = loginRes.body.data.token;
    const created = await request(app)
      .post('/organisation')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Private Org', description: 'Not owned by the requester' });

    const res = await request(app)
      .get(`/organisation/${created.body.data.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
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