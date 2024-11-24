import User from '../models/userModel';

export const createUser = async (email: string, passwordHash: string, role: string, isVerified: boolean): Promise<User> => {
  return User.create({ email, passwordHash, role, isVerified });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return User.findOne({ where: { email } });
};

export const verifyUser = async (userId: number): Promise<void> => {
  await User.update({ isVerified: true }, { where: { id: userId } });
};
