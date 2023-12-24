const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role

const Forgotpassword = sequelize.define('forgotpassword', {
    id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
       // autoIncrement: false,
        primaryKey: true
    },
    isActive: Sequelize.BOOLEAN
})

module.exports = Forgotpassword;