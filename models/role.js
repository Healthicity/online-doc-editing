'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db-connection');

class Role extends Model {
  static associate(models) {
    Role.belongsTo(models.Permission);
  }
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    permissions: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Permissions', // The name of the referenced table
        key: 'id' // The name of the referenced column
      }
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
    modelName: 'Role',
  }
);

 module.exports = Role;