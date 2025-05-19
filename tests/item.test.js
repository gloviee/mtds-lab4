const request = require('supertest');
const { app } = require('../server'); // твій Express додаток
const { connectDB, disconnectDB } = require('../database/db');
const Item = require('../models/Item');

beforeAll(async () => {
  await connectDB();
  await Item.deleteMany({}); // очищаємо колекцію перед тестами
});

afterAll(async () => {
  await disconnectDB();
});

describe('Items API', () => {
  let createdItemId;

  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'Test Item', description: 'Test description' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('Test Item');
    createdItemId = res.body._id;
  });

  it('should get all items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should delete all items', async () => {
    const res = await request(app).delete('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('All items deleted');

    // Перевіряємо, що колекція порожня
    const itemsAfterDelete = await Item.find();
    expect(itemsAfterDelete.length).toBe(0);
  });
});
