const request = require('supertest');
const { app } = require('../app');

describe('🌾 SmartKisan Core API - System Tests', () => {

  test('GET /health should return 200 and healthy state', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'healthy');
  });

  test('GET / non-existent route should return 404 format', async () => {
    const res = await request(app).get('/api/v1/not_real');
    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
  });
  
  test('GET /api/v1/admin/stats should block unauthenticated queries with 401', async () => {
    const res = await request(app).get('/api/v1/admin/stats');
    expect(res.statusCode).toEqual(401); // Should be gated by middleware
  });

});
