import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost', // Use 'redis' in Docker Compose
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'your_secure_password', // Ensure this matches your Redis config
});

/**
 * Retrieve the OTP for the given email from Redis.
 * @param email - The user's email address.
 * @returns The stored OTP or null if it has expired.
 */
export const getOtp = async (email: string): Promise<string | null> => {
    const otp = await redis.get(email);
    return otp;
  };
  