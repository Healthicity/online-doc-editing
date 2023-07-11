'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db-connection');

class DocumentVersion extends Model {
  static associate(models) {
    DocumentVersion.belongsTo(models.Document);
    DocumentDraft.belongsTo(models.User);
  }

  static findByDocId(docId, versionLimit) {
   return this.findAll({ where: { documentId: docId, isLatest: false }, order: [['lastModified', 'DESC']], limit: versionLimit})
  }

  static findRecentVersions(docId, versionLimit = 200) {
    return this.findAll({ where: { documentId: docId }, include: [User], order: [['lastModified', 'DESC']], limit: versionLimit })
  }
}

DocumentVersion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
     isLatest: {
      type: DataTypes.BOOLEAN,
    },
    versionId: {
      type: DataTypes.STRING,
      unique: true
    },
    versionName: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    content: {
      type: DataTypes.TEXT,
    },
    body: {
      type: DataTypes.TEXT,
    },
    etag: {
      type: DataTypes.STRING,
    },
    lastModified: {
      type: DataTypes.DATE,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // The name of the referenced table
        key: 'id' // The name of the referenced column
      }
    },
    documentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Documents', // The name of the referenced table
        key: 'id' // The name of the referenced column
      }
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
    modelName: 'DocumentVersion',
  }
);

module.exports = DocumentVersion;