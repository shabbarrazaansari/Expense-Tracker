const express = require('express');
const userAuthentication = require('../middleware/auth')

const router = express.Router();
const signUp =require('../controller/signup')
const expenseAdd = require('../controller/expense');
//const loginExist = require('../controller/loginExist')

router.post('/user',signUp.signup);
router.get('/',signUp.hello);
router.post('/user/login',signUp.loginExist)
router.post('/login/expense',userAuthentication.authenticate,expenseAdd.addExpense)
router.get('/login/expense',userAuthentication.authenticate, expenseAdd.getExpense)
router.delete('/login/expense/:id',userAuthentication.authenticate,expenseAdd.deleteExpense)

module.exports = router;