import { DataTypes, Model } from "sequelize";
import sequelize from "../index"; // Import the Sequelize instance

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
    timestamps: true,
  }
);

export default Token;
