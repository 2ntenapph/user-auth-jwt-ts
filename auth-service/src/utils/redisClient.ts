import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost', // Use 'redis' in Docker Compose
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || 'your_secure_password', // Ensure this matches your Redis config
});

/**
 * Generate and store OTP with a 3-minute expiration.
 * @param email - The user's email address.
 * @returns The generated OTP.
 */
export const storeOtp = async (email: string): Promise<string> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  const expiration = 180; // 3 minutes in seconds

  // Store the OTP in Redis with the email as the key
  await redis.set(email, otp, 'EX', expiration);

  return otp;
};

/**
 * Retrieve the OTP for the given email from Redis.
 * @param email - The user's email address.
 * @returns The stored OTP or null if it has expired.
 */
export const getOtp = async (email: string): Promise<string | null> => {
    const otp = await redis.get(email);
    return otp;
  };
  

/**
 * Delete the OTP for the given email from Redis.
 * @param email - The user's email address.
 */
export const deleteOtp = async (email: string): Promise<void> => {
    await redis.del(email);
  };
  
