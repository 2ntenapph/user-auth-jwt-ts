import { DataTypes, Model } from "sequelize";
import sequelize from "../index"; // Import the Sequelize instance
import { logInfo, logError } from "../../utils/loggerHelper"; // Import logger helpers

class Token extends Model {
  public id!: number;
  public userId!: number;
  public refreshToken!: string;
}

Token.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Token",
    tableName: "tokens",
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Sync the model with the database
(async () => {
  try {
    await Token.sync(); // Syncs the table in the database
    logInfo("Token Model Synced Successfully", { tableName: "tokens" });
  } catch (err: any) {
    logError("Error Syncing Token Model", err, { tableName: "tokens" });
  }
})();

export default Token;
