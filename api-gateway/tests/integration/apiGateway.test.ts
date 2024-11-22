import request from 'supertest';
import app from '../../src/app';

describe('API Gateway Integration Tests', () => {
  it('should respond correctly to a health check', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('API Gateway is running');
  });

  it('should forward requests to the Auth Service', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'password123' });

    // Assumes the Auth Service is running and reachable
    expect(response.status).toBe(201);
  });
});
