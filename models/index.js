const dbConfig = require('../config/db.config.js');
const Sequelize = require ('sequelize');

const sequelize = new Sequelize(dbConfig.DATABASE, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.Dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
      }
    
});

const db = {};
db.sequelize = sequelize;

db.Sequelize = Sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);

module.exports = db;