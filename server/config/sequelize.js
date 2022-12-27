import { Sequelize, DataTypes } from 'sequelize';
import RestaurantModel from '../models/Restaurant.js';
import DishModel from '../models/Dish.js';

const dbConfig = {
  HOST: 'localhost',
  USER: 'postgres',
  PASSWORD: '123456',
  DB: 'dinnerchamp',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const db = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  logging:
    process.env.NODE_ENV === 'production'
      ? false
      : (str) => console.log(str.brightGreen),
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

// (async () => await db.sync({ alter: true }))();
const Restaurant = RestaurantModel(db, DataTypes);
const Dish = DishModel(db, DataTypes);

Restaurant.hasMany(Dish, {
  foreignKey: 'restaurantId',
  as: 'dishes',
});

export default db;
export { Restaurant, Dish };
