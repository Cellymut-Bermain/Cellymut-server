'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      type_home: DataTypes.STRING,
      country: DataTypes.STRING,
      provinsi: DataTypes.STRING,
      postal_code: DataTypes.INTEGER,
      image_profile: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
      User.belongsToMany(models.Item, {through: 'Transaction'} )
      User.belongsToMany(models.Item, {through: 'Cart'} )
      User.belongsToMany(models.Item, {through: 'Update'} )
  };
  return User;
};