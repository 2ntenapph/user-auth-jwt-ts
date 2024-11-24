import { DataTypes, Model } from 'sequelize';
import sequelize from '../index'; // Import Sequelize setup
import { logInfo, logError } from '../../utils/loggerHelper'; // Import logger helpers

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

// Sync the model with the database
(async () => {
  try {
    await User.sync(); // Syncs the table in the database
    logInfo('User Model Synced Successfully', { tableName: 'Users' });
  } catch (err: any) {
    logError('Error Syncing User Model', err, { tableName: 'Users' });
  }
})();

export default User;
