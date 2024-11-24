import { Response } from "express";

export const setTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};


export const clearCookie = (res: Response) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });
};