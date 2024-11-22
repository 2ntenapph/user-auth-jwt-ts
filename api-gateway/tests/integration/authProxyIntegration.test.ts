import request from 'supertest';
import app from '../../src/app';

describe('Auth Proxy Integration', () => {
  it('should forward requests and handle errors from the Auth Service', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(response.status).toBe(404); // Assuming Auth Service returns 404 for invalid users
  });
});
