
const config = {
  authServiceUrl:  'http://auth-service:4000',
  emailServiceUrl: 'http://email-service:4001',
  profileServiceUrl: 'http://profile-service:4003',
  port: parseInt('4002', 10),
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
};


export default config;
