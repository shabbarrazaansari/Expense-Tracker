const express = require('express');

const router = express.Router();
const signUp =require('../controller/signup')
const expenseAdd = require('../controller/expense');
//const loginExist = require('../controller/loginExist')

router.post('/user',signUp.signup);
router.get('/',signUp.hello);
router.post('/user/login',signUp.loginExist)
router.post('/login/expense',expenseAdd.addExpense)
router.get('/login/expense',expenseAdd.getExpense)

module.exports = router;