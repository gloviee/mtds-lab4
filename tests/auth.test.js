const request = require('supertest');
const { app } = require('../server');
const { connectDB, disconnectDB } = require('../database/db');
const User = require('../models/User');

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
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

  it('should login successfully with username', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'testuser', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('email', 'test@test.com');
  });

  it('should login successfully with email', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'test@test.com', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login successful');
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('email', 'test@test.com');
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'testuser', password: 'wrongpassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'Invalid password');
  });

  it('should fail login with non-existing user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ usernameOrEmail: 'nonexistent', password: '123456' });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error', 'User not found');
  });
});