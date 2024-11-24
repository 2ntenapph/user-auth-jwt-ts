const config = {
  jwtSecret: process.env.JWT_SECRET || "defaultSecret",
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: process.env.REDIS_PORT || 6379,
  emailServiceUrl: process.env.EMAIL_SERVICE_URL || "http://email-service:4001",
  dbHost: process.env.DB_HOST || "auth-db",
  dbUser: process.env.DB_USER || "your_db_user",
  dbName: process.env.DB_NAME || "your_db_name",
  dbPassword: process.env.DB_PASS || "your_db_password",
};

export default config;
