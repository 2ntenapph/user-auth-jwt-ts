import { Response } from "express";
import { logInfo, logWarn } from "../utils/loggerHelper";

export const setTokenCookie = (res: Response, refreshToken: string) => {
  try {
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    logInfo("Refresh Token Cookie Set Successfully", {
      cookieName: "jwt",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  } catch (err: any) {
    logWarn("Failed to Set Refresh Token Cookie", { cookieName: "jwt", error: err.message });
    throw err; // Re-throw to allow the caller to handle the error
  }
};

export const clearCookie = (res: Response) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    logInfo("Refresh Token Cookie Cleared Successfully", {
      cookieName: "jwt",
    });
  } catch (err: any) {
    logWarn("Failed to Clear Refresh Token Cookie", { cookieName: "jwt", error: err.message });
    throw err; // Re-throw to allow the caller to handle the error
  }
};
