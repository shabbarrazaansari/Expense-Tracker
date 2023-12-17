const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

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
    const saltRounds = 10;
    bcrypt.hash(password,saltRounds,async (err,hash)=>{ 
        const data = await user.create({
        name:name,
        email:email,
        password:hash
    })
    res.status(201).json({user:data})
    })
   
    
   } catch (error) {
    res.status(500).json(error)
   }
    
}

exports .loginExist = async (req,res,next)=>{
    // console.log(req.body);
    const {email,password} = req.body;
    if(ifStringValid(email) || ifStringValid(password)){
        return res.status(400).json({success:false,message:"email or password is missing"})
    }
    await user.findAll({where:{email}})
    .then(user=>{
        // console.log(user)
       bcrypt.compare(password,user[0].password,(err,result)=>{
        if(err){
            throw new Error();
        } if(result === true) {
            return res.status(200).json({success:true,message:"user login successfully",token:generateWebToken(user[0].id)})
        }
        else {
            return res.status(400).json({success:false,message:'password is incorrect'})
        }
       })
   
    })
    .catch((err)=>{
        return res.status(404).json({success:false,message:'user does not exist'})
    })
    
}
function generateWebToken(id) {
    return jwt.sign({userId:id},'8090501210')
}
exports.hello = (req,res,next)=>{
    res.send('hello ia server')
}
