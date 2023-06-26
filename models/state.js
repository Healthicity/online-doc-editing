'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  State.statics.findByState = async function (states) {
    states = states.map(st => new RegExp(st, 'i'))
    const data = await this.find({ state: { $in: states } }, '_id')
    return data.map(doc => doc.id)
  }


  return State;
};