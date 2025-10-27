import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

export const Tag = sequelize.define(
    "tag",
    {
        tag_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        // deck_id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        timestamps: false,
        // underscored: true,
        // updatedAt: false,
    },
)
