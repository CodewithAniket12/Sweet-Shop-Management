// backend/__tests__/auth.test.js
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from '../index';

describe('Auth API', () => {
  it('POST /api/auth/register --> should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register') // This endpoint does not exist yet
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});