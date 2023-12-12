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
            return res.status(400).json({error:"bad parameters something went wrong"})
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
exports.hello = (req,res,next)=>{
    res.send('hello ia server')
}
