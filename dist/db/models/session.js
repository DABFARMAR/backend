'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'id_user' });
    }
  }
  Session.init({
    id_user: DataTypes.NUMBER,
    token: DataTypes.STRING,
    expiration: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Session',
  });
  return Session;
};
