import request from 'supertest';
import app from '../../src/app';
import nock from 'nock';

describe('Auth Proxy Route', () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it('should proxy a request to the Auth Service', async () => {
    nock('http://auth-service:4000')
      .post('/signup')
      .reply(201, { message: 'User created' });

    const response = await request(app)
      .post('/auth/signup')
      .send({ email: 'test@example.com', password: 'password123', role: 'user' });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User created');
  });
});
