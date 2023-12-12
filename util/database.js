const Sequelize = require('sequelize');

const sequelize = new Sequelize('expenses', 'root', '0310', {
    host: 'localhost',
    dialect:'mysql'
  });

module.exports = sequelize;