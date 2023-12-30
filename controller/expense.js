const express = require('express')
const Sequelize = require('sequelize');
const User = require('../models/user');
const Income = require('../models/income');
const sequelize = require('../util/database');
const AWS = require('aws-sdk');


const expense = require('../models/expense');
const incomes = require('../models/income');
// const incomes = require('../models/income');

exports .addExpense = async(req,res,next)=>{
    console.log(req.body);
    const t = await sequelize.transaction();
    const {amount,description,category,income,date} = req.body;
    console.log("hello income",income)
    
    if(amount == undefined || amount.length == 0){
        res.status(400).json({success:true,message:"bad Parameters"})
    }
        
    try {
        const data = await expense.create({amount:amount,description:description,category:category,date:date,userId:req.user.id},{transaction:t});
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
        const isprime = await User.findOne({
            where:{id:req.user.id}
        })
        if(isprime.ispremiumuser){
            await Income.create({amount:income,userId:req.user.id,expenseId:data.id});//adddedexpenseid


        }

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
        const details = await expense.findAll({where:{userId:req.user.id},include:incomes });
        // console.log(details);
        res.status(200).json(details)
    } catch (error) {
        console.log(error)
    }
}

function uploadToS3(data , fileName){
    const BUCKET_NAME = 'checkexp';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;


    let s3Bucket = new AWS.S3({

       accessKeyId :IAM_USER_KEY,
       secretAccessKey : IAM_USER_SECRET,
      // bucket:BUCKET_NAME
    });

    
         const params = {
             Bucket : BUCKET_NAME,
             Key:  fileName,
             Body: data,
             ACL : 'public-read'
         }
  
          return new Promise( (res ,rej ) =>{
                  
            s3Bucket.upload(params,  (err, s3response) =>{
                if(err){

                    console.log("Somthing WentWrong..",err)
                    rej(err);

                }
                else{
                  console.log(s3response.Location);  
                     res(s3response.Location)
                }
          })
 
          })
       
    


};

exports.getDowndload = async (req,res,next) =>{
     
   
       try { 
          const userId = req.user.id;
          const expenses = await expense.findAll({where:{userId:userId},include:incomes });
          console.log(expenses)
 
       
 
 
          const stringifiedExpenses = JSON.stringify(expenses);
          const fileName =`Expenses${userId}/${new Date()}.txt`;
         
           let Url = await uploadToS3(stringifiedExpenses, fileName);
           console.log(Url)
           
          
 
          res.status(201).json({ success:true , url: Url});
        
       } catch (error) {
        console.log(error)
       }
       /////
       


  
            

};