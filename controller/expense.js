const express = require('express')
const Sequelize = require('sequelize');

const expense = require('../models/expense');

exports .addExpense = async(req,res,next)=>{
    console.log(req.body);
    const {amount,description,category} = req.body;
    try {
        const data = await expense.create({amount:amount,description:description,category:category});
        res.status(200).json(data)
        // console.log(data)
        // console.log("expense created")
    } catch (error) {
        console.log(error)
    }    

}

exports .getExpense = async (req,res,next)=>{
    try {
        const details = await expense.findAll();
        res.status(200).json(details)
    } catch (error) {
        console.log(error)
    }
}