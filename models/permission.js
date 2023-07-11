'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db-connection');

class Permission extends Model {
  static associate(models) {
    Permission.hasMany(models.Role);
  }
}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Permission',
  }
);

 module.exports = Permission;