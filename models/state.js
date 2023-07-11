'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db-connection');

class State extends Model {
  static associate(models) {
    State.hasMany(models.DocumentDraft);
    State.hasMany(models.DocumentDraft);
  }

  static findByState(states) {
    states = states.map(st => new RegExp(st, 'i'))
    const data =  this.findAll({ where: { state: { id: states } }})
    return data.map(doc => doc.id)
  }
}

State.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    state: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.INTEGER,
    },
    description: {
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
    modelName: 'State',
  }
);

module.exports = State;