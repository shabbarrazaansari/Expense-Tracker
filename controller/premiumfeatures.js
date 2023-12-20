const User = require('../models/user');

const Expense = require('../models/expense');
const sequelize = require('../util/database');
const user = require('../models/user');

exports .getLeaderboad = async (req,res)=>{
    try {

        const users = await User.findAll();
        const expenses =  await Expense.findAll();
        const userTotalExpense = {};
        expenses.forEach((expense) => {
             if(userTotalExpense[expense.userId]){
                userTotalExpense[expense.userId] = userTotalExpense[expense.userId] + expense.amount
             }
             else {
                userTotalExpense[expense.userId] = expense.amount;
             }
        })
        var userLeaderBoardDetails = [];
        users.forEach((user)=> {
            userLeaderBoardDetails.push({name:user.name,total_cost:userTotalExpense[user.id]})
        })
        console.log(userLeaderBoardDetails);
        res.status(200).json(userLeaderBoardDetails)
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(err);
    }
}
