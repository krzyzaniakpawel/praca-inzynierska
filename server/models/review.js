import { DataTypes } from "sequelize"
import { sequelize } from "../config/database.js"
import { Flashcard } from "./flashcard.js"

export const Review = sequelize.define(
    "review",
    {
        flashcard_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,  // relacja 1:1
            allowNull: false,
            references: {
                model: Flashcard,
                key: "flashcard_id",
            },
            onDelete: "CASCADE",
        },
        repetition: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        interval_days: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        efactor: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 2.5,
        },
        last_review: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        next_review: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("new", "learning", "review"),
            allowNull: false,
            defaultValue: "new",
        },
    },
    {
        timestamps: false,
        underscored: true,
    }
)

