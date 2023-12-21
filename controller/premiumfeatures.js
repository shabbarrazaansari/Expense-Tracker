// const User = require('../models/user');
const Sequelize = require('sequelize');

const Expense = require('../models/expense');
const sequelize = require('../util/database');
const User = require('../models/user'); // Correcting the model name

exports.getLeaderboard = async (req, res) => {
    try {
        const userLeaderBoardDetails = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        });

        res.status(200).json(userLeaderBoardDetails);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
