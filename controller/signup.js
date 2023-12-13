const express = require('express');

const user = require('../models/user');
function ifStringValid(string) {
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
    
}

exports .signup = async(req,res,next)=>{
    console.log(req.body);
    const {name,email,password} = req.body;
      if(ifStringValid(name) || ifStringValid(email) || ifStringValid(password)){
            return res.status(400).json({message:"bad parameters something went wrong"})
        }

   try {
    const data = await user.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    })
    res.status(201).json({user:data})
   } catch (error) {
    res.status(500).json(error)
   }
    
}

exports .loginExist = async (req,res,next)=>{
    console.log(req.body);
    const {email,password} = req.body;
    if(ifStringValid(email) || ifStringValid(password)){
        return res.status(400).json({success:false,message:"email or password is missing"})
    }
    await user.findAll({where:{email}})
    .then(user=>{
        console.log(user)
        if(user[0].password ===password){
           return res.status(200).json({success:true,message:"user login successfully"})
        }
        else{
            return res.status(400).json({success:false,message:'password is incorrect'})
        }
    })
    .catch((err)=>{
        return res.status(404).json({success:false,message:'user does not exist'})
    })
    
}
exports.hello = (req,res,next)=>{
    res.send('hello ia server')
}
