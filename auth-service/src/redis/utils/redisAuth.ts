import redis from "../config";

/**
 * Add a token's `jti` to the Redis blocklist with a TTL.
 * @param jti - The unique identifier of the token.
 * @param exp - Token expiration time (in seconds since epoch).
 */
export const addToBlocklist = async (
  jti: string,
  exp: number
): Promise<void> => {
  const ttl = exp * 1000 - Date.now(); // TTL in milliseconds
  if (ttl > 0) {
    await redis.set(`blocklist:${jti}`, "true", "PX", ttl); // Store "true" as a string
  }
};

/**
 * Check if a token's `jti` is in the Redis blocklist.
 * @param jti - The unique identifier of the token.
 * @returns `true` if the token is in the blocklist, otherwise `false`.
 */
export const isInBlocklist = async (jti: string): Promise<boolean> => {
  const exists = await redis.get(`blocklist:${jti}`);
  return exists === "true"; // Compare with the stored value
};
