'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db-connection');

class DocumentDraft extends Model {
  static associate(models) {
    DocumentDraft.belongsTo(models.Document);
    DocumentDraft.belongsTo(models.State);
  }
}

DocumentDraft.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    bucket: {
      type: DataTypes.STRING,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    path: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    body: {
      type: DataTypes.TEXT,
    },
    extension: {
      type: DataTypes.STRING,
    },
    contentLength: {
      type: DataTypes.INTEGER,
    },
    etag: {
      type: DataTypes.STRING,
    },
    lastModified: {
      type: DataTypes.DATE,
    },
    stateId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'States', // The name of the referenced table
        key: 'id' // The name of the referenced column
      }
    },
    users: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      // references: {
      //   model: 'Users', // The name of the referenced table
      //   key: 'id', // The name of the referenced column
      //   deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      // },
      defaultValue: []
    },
    documentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Documents', // The name of the referenced table
        key: 'id' // The name of the referenced column
      }
    },
    userConfirmations: {
      type: DataTypes.INTEGER,
      defaultValue: 0
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
    modelName: 'DocumentDraft',
  }
);

module.exports = DocumentDraft;