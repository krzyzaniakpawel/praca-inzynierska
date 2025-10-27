import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"

export const Flashcard = sequelize.define(
  "flashcard",
  {
    flashcard_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    deck_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    term: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    definition: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
  }
)
