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
exports.deleteExpense = async (req,res,next)=>{
//    console.log("hello params",req.params)
    const deletId = req.params.id;
    try {
        await expense.destroy({where :{id:deletId,userId:req.user.id}}).then(noofrows=>{
            if(noofrows===0){
                return res.status(404).json({success:false,message:'expense belongs to other user'})
            }
            else {
                return res.status(200).json({success:true,message:"delete successfully"})
            }
            
        })
       
    } catch (error) {
     console.log(error) ;  
    }
}

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