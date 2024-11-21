import { DataTypes, Model } from 'sequelize';
import sequelize from './db';  // Import Sequelize setup

interface IUser {
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  otp: string | null;
  otpExpiration: Date | null;
}

class User extends Model<IUser> implements IUser {
  public email!: string;
  public password!: string;
  public role!: string;
  public isVerified!: boolean;
  public otp!: string | null;
  public otpExpiration!: Date | null;
}

User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

// Sync the database (create tables if they don't exist)
User.sync();

export default User;
