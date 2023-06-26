'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DocumentDraft.hasMany(models.User, {
        foreignKey: {
          name: 'users',
          field: 'users',
          allowNull: true
        },
        sourceKey: 'id'
      });
    }
  }
  return User;
};