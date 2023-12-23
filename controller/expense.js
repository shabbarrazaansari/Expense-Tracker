const express = require('express')
const Sequelize = require('sequelize');
const User = require('../models/user');
const sequelize = require('../util/database');

const expense = require('../models/expense');

exports .addExpense = async(req,res,next)=>{
    // console.log(req.body);
    const t = await sequelize.transaction();
    const {amount,description,category} = req.body;
    
    if(amount == undefined || amount.length == 0){
        res.status(400).json({success:true,message:"bad Parameters"})
    }
        
    try {
        const data = await expense.create({amount:amount,description:description,category:category,userId:req.user.id},{transaction:t});
        const totalExpense = Number(req.user.totalExpenses) + Number(amount);
        console.log(totalExpense);
        await User.update({
            totalExpenses:totalExpense,
            
        },
        {
            where:{id:req.user.id},
            transaction:t
        });
        await t.commit();

        res.status(201).json(data)
        // console.log(data)
        // console.log("expense created")
    } catch (error) {
        await t.rollback();
        console.log(error)
    }    

}
exports.deleteExpense = async (req, res, next) => {
    const deleteId = req.params.id;
    const t = await sequelize.transaction();

    try {
        const deletedExpense = await expense.findOne({
            where: { id: deleteId, userId: req.user.id },
            transaction: t,
        });

        if (!deletedExpense) {
            await t.rollback();
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        const deletedAmount = deletedExpense.amount;

        await expense.destroy({
            where: { id: deleteId, userId: req.user.id },
            transaction: t,
        });

        const updatedTotalExpenses = Number(req.user.totalExpenses) - Number(deletedAmount);

        await User.update(
            { totalExpenses: updatedTotalExpenses },
            { where: { id: req.user.id }, transaction: t }
        );

        await t.commit();

        return res.status(200).json({ success: true, message: 'Expense deleted successfully' });

    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


exports .getExpense = async (req,res,next)=>{
    try {
        //  console.log("me id",req.user)
        const details = await expense.findAll({where:{userId:req.user.id}});
        // console.log(details);
        res.status(200).json(details)
    } catch (error) {
        console.log(error)
    }
}