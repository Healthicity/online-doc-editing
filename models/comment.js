'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db-connection');

class Comment extends Model {
  static associate(models) {
    Comment.belongsTo(models.User);
    Comment.belongsTo(models.Edition);
  }
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
     editionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Editions', // The name of the referenced table
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
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
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
    modelName: 'Comment',
  }
);

module.exports = Comment;