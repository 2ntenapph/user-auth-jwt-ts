import { DataTypes, Model } from 'sequelize';
import sequelize from '../index';  // Import Sequelize setup

interface IUser {
  id?: number; 
  email: string;
  passwordHash: string;
  role?: string;
  isVerified?: boolean;
}

class User extends Model<IUser> implements IUser {
  public id?: number; 
  public email!: string;
  public passwordHash!: string;
  public role!: string;
  public isVerified!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
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
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
  }
);

// Sync the database (create tables if they don't exist)
User.sync();

export default User;
