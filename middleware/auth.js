const jwt  = require('jsonwebtoken');
const User = require('../models/user');
const Sequelize = require('sequelize')

exports .authenticate = async (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        console.log(token);
        const checkUser = jwt.verify(token,process.env.TOKEN_SECRET);
        console.log(checkUser.userId);
        const user = await User.findByPk(checkUser.userId);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
    }
}
//module.exports = authenticate ;

