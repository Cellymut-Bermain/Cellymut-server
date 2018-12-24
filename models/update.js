'use strict';
module.exports = (sequelize, DataTypes) => {
  const Update = sequelize.define('Update', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
      },
      UserId: DataTypes.INTEGER,
      message: DataTypes.STRING,
      ItemId: DataTypes.INTEGER,
      TransactionId: DataTypes.STRING,
      type: DataTypes.INTEGER,
      status_read: DataTypes.INTEGER
  }, {});
  Update.associate = function(models) {
    // associations can be defined here
      Update.belongsTo(models.Item)
      Update.belongsTo(models.User)
      // Update.hasMany(models.Transaction)
      Update.belongsTo(models.Transaction)
  };
  return Update;
};