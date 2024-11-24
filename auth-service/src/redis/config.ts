import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost", // Use 'redis' in Docker Compose
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD || "your_secure_password", // Ensure this matches your Redis config
});

export default redis;