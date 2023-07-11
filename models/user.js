'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db-connection');

class User extends Model {
  static associate(models) {
    User.hasMany(models.DocumentDraft);
    User.hasMany(models.Edition);
    User.belongsTo(models.Role);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles', // The name of the referenced table
        key: 'id', // The name of the referenced column
      },
    },
    password: {
      type: DataTypes.STRING,
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
    modelName: 'User',
  }
);

module.exports = User;

