'use strict';
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
      item_name: DataTypes.STRING,
      item_price: DataTypes.STRING,
      item_stocks: DataTypes.INTEGER,
      item_image: DataTypes.STRING,
      image_name: DataTypes.STRING,
      status: DataTypes.INTEGER,
      parent_id: DataTypes.INTEGER,
      color: DataTypes.STRING,
      size: DataTypes.STRING

  }, {});
  Item.associate = function(models) {
    // associations can be defined here
      Item.belongsToMany(models.User,{ through : 'Transaction'})
      Item.belongsToMany(models.User,{ through : 'Cart'})
      Item.belongsToMany(models.User,{ through : 'Update'})
  };
  return Item;
};