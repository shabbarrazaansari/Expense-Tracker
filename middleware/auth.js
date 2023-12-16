const jwt  = require('jsonwebtoken');
const User = require('../models/user');
const Sequelize = require('sequelize')

exports .authenticate = (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        console.log(token);
        const user = jwt.verify(token,'8090501210');
        console.log(user.userId);
        User.findByPk(user.userId).then(user=>{
            req.user = user;
            next();
        })
    } catch (error) {
        console.log(error);
    }
}
//module.exports = authenticate ;