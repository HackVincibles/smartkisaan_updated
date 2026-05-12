const request = require('supertest');
const { app, server } = require('../app');
const mongoose = require('mongoose');

/**
 * T135-139 — Integration Tests
 */
describe('SmartKisan API Integration', () => {
  let token;
  jest.setTimeout(15000);

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  // T135 — Auth Test
  it('should register a new farmer', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register/farmer')
      .send({
        phone: '7' + Math.floor(100000000 + Math.random()*900000000),
        name: 'Jest Tester'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  // T136 — Listing Test
  it('should fetch my listings', async () => {
    const res = await request(app)
      .get('/api/v1/farmer/listings')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });

  // T137 — AI Health Test
  it('should check AI health', async () => {
    const res = await request(app)
      .get('/api/v1/ai/health')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
  });
});
