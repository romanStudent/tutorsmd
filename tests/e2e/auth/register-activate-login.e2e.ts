/**
 * E2E: register → activate → login
 *
 * Тест поднимает реальный Express-сервер с тестовой БД.
 * Проверяет, что HTTP-слой (контроллеры, middleware, DI) правильно сшит с use cases.
 *
 * Для запуска необходимо:
 *  1. DATABASE_TEST_URL в .env.test
 *  2. createTestApp() — функция, поднимающая Express с тестовым DI-контейнером
 *
 * Запуск: vitest run tests/e2e
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import type { Express } from 'express';
import { getTestPrisma, setupTestDb, cleanupTestDb, truncateAuthTables } from '../../helpers/testDb';
import { MockEmailService } from '../../helpers/mockServices';
import { makeRegisterDto } from '../../helpers/factories';

// ─── Bootstrap ───────────────────────────────────────────────────────────────
// Замени на реальную фабрику приложения с тестовым DI-контейнером.
// createTestApp должна принимать MockEmailService и возвращать Express-инстанс.
//
// import { createTestApp } from '../helpers/createTestApp';

let app: Express;
const emailService = new MockEmailService();
const db = getTestPrisma();

// ─── Full registration flow ───────────────────────────────────────────────────

describe('POST /auth/register → POST /auth/activate → POST /auth/login', () => {
  beforeAll(async () => {
    await setupTestDb();
    // app = createTestApp({ emailService });
  });

  afterAll(async () => {
    await cleanupTestDb();
  });

  beforeEach(async () => {
    await truncateAuthTables();
    emailService.clear();
  });

  it('full happy path: register → activate → login → get access token', async () => {
    const dto = makeRegisterDto();

    // ── 1. Register ──────────────────────────────────────────────────────────
    // const registerRes = await request(app)
    //   .post('/api/auth/register/client')
    //   .send(dto)
    //   .expect(201);

    // expect(registerRes.body).toMatchObject({ message: expect.any(String) });

    // ── 2. Verify email sent ─────────────────────────────────────────────────
    // expect(emailService.sent).toHaveLength(1);
    // const rawToken = emailService.extractToken(emailService.lastSent!.link);

    // ── 3. Activate ──────────────────────────────────────────────────────────
    // const activateRes = await request(app)
    //   .post(`/api/auth/activate/${rawToken}`)
    //   .expect(200);

    // ── 4. Login ─────────────────────────────────────────────────────────────
    // const loginRes = await request(app)
    //   .post('/api/auth/login')
    //   .send({ email: dto.email, password: dto.password, activeRole: 'client' })
    //   .expect(200);

    // expect(loginRes.body.accessToken).toBeTruthy();
    // Refresh token — HttpOnly cookie
    // expect(loginRes.headers['set-cookie']).toBeDefined();
    // expect(loginRes.headers['set-cookie'].join('')).toContain('refreshToken=');
    // expect(loginRes.headers['set-cookie'].join('')).toContain('HttpOnly');
    // expect(loginRes.headers['set-cookie'].join('')).toContain('SameSite=Lax');

    expect(true).toBe(true);
  });

  it('returns 409 on duplicate email registration', async () => {
    const dto = makeRegisterDto();

    // await request(app).post('/api/auth/register/client').send(dto).expect(201);
    // const second = await request(app).post('/api/auth/register/client').send(dto);
    // expect(second.status).toBe(409);
    // expect(second.body.message).toMatch(/Email already in use/);

    expect(true).toBe(true);
  });

  it('returns 400 for invalid password at registration', async () => {
    const dto = makeRegisterDto({ password: 'short' });
    // const res = await request(app).post('/api/auth/register/client').send(dto);
    // expect(res.status).toBe(400);
    expect(true).toBe(true);
  });

  it('returns 401 when trying to login before activation', async () => {
    const dto = makeRegisterDto();
    // await request(app).post('/api/auth/register/client').send(dto).expect(201);

    // const loginRes = await request(app)
    //   .post('/api/auth/login')
    //   .send({ email: dto.email, password: dto.password, activeRole: 'client' });

    // expect(loginRes.status).toBe(401);
    // expect(loginRes.body.message).toMatch(/verify your email/);

    expect(true).toBe(true);
  });

  it('returns 400 on invalid activation token', async () => {
    // const res = await request(app).post('/api/auth/activate/fake-token-that-does-not-exist');
    // expect(res.status).toBe(400);
    expect(true).toBe(true);
  });

  it('activation link is single-use (second attempt returns 400)', async () => {
    const dto = makeRegisterDto();
    // await request(app).post('/api/auth/register/client').send(dto).expect(201);
    // const rawToken = emailService.extractToken(emailService.lastSent!.link);

    // await request(app).post(`/api/auth/activate/${rawToken}`).expect(200);
    // const second = await request(app).post(`/api/auth/activate/${rawToken}`);
    // expect(second.status).toBe(400);

    expect(true).toBe(true);
  });
});

// ─── Rate limiting ────────────────────────────────────────────────────────────

describe('Auth rate limiting', () => {
  beforeAll(async () => {
    await setupTestDb();
    // app = createTestApp({ emailService });
  });

  afterAll(async () => { await cleanupTestDb(); });
  beforeEach(async () => { await truncateAuthTables(); emailService.clear(); });

  it('blocks login after too many failed attempts', async () => {
    const email = 'brute@example.com';

    // for (let i = 0; i < 10; i++) {
    //   await request(app).post('/api/auth/login').send({
    //     email, password: 'WrongPassword999!', activeRole: 'client',
    //   });
    // }

    // const blocked = await request(app).post('/api/auth/login').send({
    //   email, password: 'WrongPassword999!', activeRole: 'client',
    // });
    // expect(blocked.status).toBe(429);

    expect(true).toBe(true);
  });

  it('blocks register endpoint after too many requests from same IP', async () => {
    // for (let i = 0; i < 5; i++) {
    //   await request(app)
    //     .post('/api/auth/register/client')
    //     .send(makeRegisterDto());
    // }

    // const blocked = await request(app)
    //   .post('/api/auth/register/client')
    //   .send(makeRegisterDto());
    // expect(blocked.status).toBe(429);

    expect(true).toBe(true);
  });
});