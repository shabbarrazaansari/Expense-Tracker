const express = require('express');

const router = express.Router();
const signUp =require('../controller/signup')
//const loginExist = require('../controller/loginExist')

router.post('/user',signUp.signup);
router.get('/',signUp.hello);
router.post('/user/login',signUp.loginExist)

module.exports = router;