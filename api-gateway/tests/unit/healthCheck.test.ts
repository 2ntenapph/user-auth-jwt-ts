import request from 'supertest';
import app from '../../src/app';

describe('Health Check Route', () => {
  it('should return a 200 status and message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('API Gateway is running');
  });
});
