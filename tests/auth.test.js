const request = require('supertest');
const { app } = require('../server');
const { connectDB, disconnectDB } = require('../database/db');

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'testuser', email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(201);
  });
});
