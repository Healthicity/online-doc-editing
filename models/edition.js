'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db-connection');

class Edition extends Model {
  static associate(models) {
    Edition.hasMany(models.Comment);
    Edition.belongsTo(models.Document);
    Edition.belongsTo(models.User);
  }
}

Edition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    documentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Documents', // The name of the referenced table
        key: 'id' // The name of the referenced column
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // The name of the referenced table
        key: 'id' // The name of the referenced column
      },
    },
    content: {
      type: DataTypes.TEXT,
    },
    body: {
      type: DataTypes.TEXT,
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
    modelName: 'Edition',
  }
);

 module.exports = Edition;
