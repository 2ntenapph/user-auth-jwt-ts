import Token from "../models/tokenModel";

export const saveRefreshToken = async (
  userId: number,
  refreshToken: string,
): Promise<Token> => {
  return Token.create({ userId, refreshToken });
};

export const findRefreshToken = async (
  refreshToken: string
): Promise<Token | null> => {
  return Token.findOne({ where: { refreshToken } });
};

export const deleteRefreshToken = async (refreshToken: string): Promise<void> => {
  await Token.destroy({ where: { refreshToken } });
};

export const deleteAllUserTokens = async (userId: number): Promise<void> => {
  await Token.destroy({ where: { userId } });
};
