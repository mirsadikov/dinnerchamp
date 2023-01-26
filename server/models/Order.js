export default function (sequelize, DataTypes) {
  const model = sequelize.define('order', {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    total: {
      type: DataTypes.INTEGER(15),
      allowNull: false,
      defaultValue: 0,
    },
    ordererName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ordererPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    // timestapms only createdAt
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: false,
  });

  return model;
}