'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
      id: {
          type: DataTypes.STRING,
          primaryKey: true,
      },
      UserId: DataTypes.INTEGER,
      ItemId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      total: DataTypes.INTEGER,
      status_transaction: DataTypes.INTEGER,
      type_courier: DataTypes.STRING,
      cost_courier: DataTypes.INTEGER,
      alamat_pengiriman: DataTypes.STRING,
      phone_number: DataTypes.STRING
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
      Transaction.belongsTo(models.Item)
      Transaction.belongsTo(models.User)
      Transaction.hasMany(models.Update)
  };
  return Transaction;
};