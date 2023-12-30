const Sequelize = require('sequelize')

const sequelize = require('../util/database');

const incomes = sequelize.define('incomes' ,{
      id:{
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey:true
      },
      amount:Sequelize.STRING,
      description: Sequelize.STRING,
      category: Sequelize.STRING,
      date:Sequelize.STRING,
      time:Sequelize.STRING

});

module.exports = incomes;