import { sequelize } from '../config/database.js'
import { DataTypes } from 'sequelize'

export const User = sequelize.define(
    'user', 
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.INTEGER,
        },
        is_admin: {
            type: DataTypes.TINYINT,
        }
    },
    {
        timestamps: true,
        underscored: true,
        updatedAt: false,
    },
)
