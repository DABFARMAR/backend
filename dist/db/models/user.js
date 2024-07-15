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
      //this.hasMany(models.Role, { foreignKey: 'id_user' });
      this.hasMany(models.Session, { foreignKey: 'id_user' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    cellphone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
