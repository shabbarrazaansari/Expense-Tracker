// const User = require('../models/user');
const Sequelize = require('sequelize');

const Expense = require('../models/expense');
const sequelize = require('../util/database');
const User = require('../models/user'); // Correcting the model name

exports.getLeaderboard = async (req, res) => {
    try {
        const userLeaderBoardDetails = await User.findAll({
            attributes: ['id', 'name', [Sequelize.fn('sum', Sequelize.col('Expenses.amount')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['User.id'], // Correcting the table name in group
            order: [['total_cost', 'DESC']]
        });

        res.status(200).json(userLeaderBoardDetails);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
};
