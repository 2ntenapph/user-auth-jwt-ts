import Token from "../models/tokenModel";
import { logInfo, logWarn, logError } from "../../utils/loggerHelper";

export const saveRefreshToken = async (
  userId: number,
  refreshToken: string
): Promise<Token> => {
  try {
    const token = await Token.create({ userId, refreshToken });
    logInfo("Refresh Token Saved Successfully", { userId, refreshToken });
    return token;
  } catch (err: any) {
    logError("Error Saving Refresh Token", err, { userId, refreshToken });
    throw err; // Re-throw the error to let the caller handle it
  }
};

export const findRefreshToken = async (
  refreshToken: string
): Promise<Token | null> => {
  try {
    const token = await Token.findOne({ where: { refreshToken } });
    if (token) {
      logInfo("Refresh Token Found", { refreshToken });
    } else {
      logWarn("Refresh Token Not Found", { refreshToken });
    }
    return token;
  } catch (err: any) {
    logError("Error Finding Refresh Token", err, { refreshToken });
    throw err; // Re-throw the error to let the caller handle it
  }
};

export const deleteRefreshToken = async (refreshToken: string): Promise<void> => {
  try {
    const rowsDeleted = await Token.destroy({ where: { refreshToken } });
    if (rowsDeleted > 0) {
      logInfo("Refresh Token Deleted Successfully", { refreshToken });
    } else {
      logWarn("Refresh Token Deletion Failed: Token Not Found", { refreshToken });
    }
  } catch (err: any) {
    logError("Error Deleting Refresh Token", err, { refreshToken });
    throw err; // Re-throw the error to let the caller handle it
  }
};

export const deleteAllUserTokens = async (userId: number): Promise<void> => {
  try {
    const rowsDeleted = await Token.destroy({ where: { userId } });
    logInfo("All Refresh Tokens Deleted for User", { userId, tokensDeleted: rowsDeleted });
  } catch (err: any) {
    logError("Error Deleting All User Refresh Tokens", err, { userId });
    throw err; // Re-throw the error to let the caller handle it
  }
};
