'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DocumentVersion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  DocumentVersion.statics.findByDocId = async function (docId, versionLimit) {
    return await this.find({ documentId: docId, isLatest: false }, '-body -content').sort({ lastModified: 'desc' }).limit(versionLimit)
  }

  DocumentVersion.statics.findRecentVersions = async function (docId, versionLimit = 200) {
    return await this.find({ documentId: docId }, 'lastModified versionId versionName userId')
      .sort({ lastModified: 'desc' })
      .limit(versionLimit)
      .populate('userId')
  }

  return DocumentVersion;
};