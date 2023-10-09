'use strict'
const { Model, DataTypes } = require('sequelize')
const sequelize = require('../config/db-connection')

class User extends Model {
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    modelName: 'users',
    timestamps: false
  }
)

module.exports = User
