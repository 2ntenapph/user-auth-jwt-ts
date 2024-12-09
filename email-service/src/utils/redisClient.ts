import Redis from 'ioredis';
import { logInfo, logWarn, logError } from './loggerHelper'; // Logging helpers

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost', // Use 'redis' in Docker Compose
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'your_secure_password', // Match Redis configuration
});

// Event listeners for Redis connection and errors
redis.on('connect', () => {
  logInfo('Connected to Redis', {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  });
});

redis.on('error', (error: any) => {
  logError('Redis Connection Error', error, {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  });
});

/**
 * Retrieve the OTP for the given email from Redis.
 * @param email - The user's email address.
 * @returns The stored OTP or null if it has expired.
 */
export const getOtp = async (email: string): Promise<string | null> => {
  try {
    const otp = await redis.get(email);

    if (otp) {
      logInfo('OTP Retrieved Successfully', { email });
    } else {
      logWarn('OTP Not Found or Expired', { email });
    }

    return otp;
  } catch (error: any) {
    logError('Error Retrieving OTP', error, { email });
    throw error; // Re-throw error to allow caller to handle it
  }
};
