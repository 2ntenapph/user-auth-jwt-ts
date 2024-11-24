import User from '../models/userModel';
import { logInfo, logWarn, logError } from '../../utils/loggerHelper'; // Logging helpers

/**
 * Creates a new user in the database.
 * @param email - The email of the user.
 * @param passwordHash - The hashed password of the user.
 * @param role - The role of the user.
 * @param isVerified - The verification status of the user.
 * @returns The created user.
 */
export const createUser = async (
  email: string,
  passwordHash: string,
  role: string,
  isVerified: boolean
): Promise<User> => {
  try {
    const user = await User.create({ email, passwordHash, role, isVerified });
    logInfo("User Created Successfully", { email, role, isVerified });
    return user;
  } catch (err: any) {
    logError("Error Creating User", err, { email, role, isVerified });
    throw err; // Re-throw to allow the caller to handle the error
  }
};

/**
 * Finds a user by their email address.
 * @param email - The email to search for.
 * @returns The user if found, otherwise null.
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await User.findOne({ where: { email } });
    if (user) {
      logInfo("User Found by Email", { email });
    } else {
      logWarn("User Not Found by Email", { email });
    }
    return user;
  } catch (err: any) {
    logError("Error Finding User by Email", err, { email });
    throw err; // Re-throw to allow the caller to handle the error
  }
};

/**
 * Marks a user as verified.
 * @param userId - The ID of the user to verify.
 */
export const verifyUser = async (userId: number): Promise<void> => {
  try {
    const [updatedRows] = await User.update({ isVerified: true }, { where: { id: userId } });
    if (updatedRows > 0) {
      logInfo("User Verified Successfully", { userId });
    } else {
      logWarn("User Verification Failed: User Not Found", { userId });
    }
  } catch (err: any) {
    logError("Error Verifying User", err, { userId });
    throw err; // Re-throw to allow the caller to handle the error
  }
};
