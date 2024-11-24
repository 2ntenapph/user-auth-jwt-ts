import redis from "../config";


/**
 * Generate and store OTP with a 3-minute expiration.
 * @param email - The user's email address.
 * @returns The generated OTP.
 */
export const storeOtp = async (email: string): Promise<string> => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  const expiration = 180; // 3 minutes in seconds

  await redis.set(email, otp, "EX", expiration); // Store OTP with expiration
  return otp;
};

/**
 * Retrieve the OTP for the given email from Redis.
 * @param email - The user's email address.
 * @returns The stored OTP or `null` if expired.
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
