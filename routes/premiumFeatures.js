const express = require('express');

const userAuthentication = require('../middleware/auth')
const controller = require('../controller/premiumfeatures')
const download = require('../controller/expense')

const router = express.Router();

router.get('/premium/showleaderboard',userAuthentication.authenticate,controller.getLeaderboard);
router.get('/download',userAuthentication.authenticate,download.getDowndload);
router.get('/premium/expense',userAuthentication.authenticate,download.premiumGetExpense)

module.exports = router;