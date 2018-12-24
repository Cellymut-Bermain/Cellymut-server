'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
      UserId: DataTypes.INTEGER,
      ItemId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      name: DataTypes.STRING,
      status_cart : DataTypes.INTEGER
  }, {});
  Cart.associate = function(models) {
    // associations can be defined here
      Cart.belongsTo(models.Item)
      Cart.belongsTo(models.User)
  };
  return Cart;
};