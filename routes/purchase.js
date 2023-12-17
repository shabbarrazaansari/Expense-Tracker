const express = require('express');
const userAuthentication = require('../middleware/auth')

const router = express.Router();

const purchasePremium = require('../controller/purchase')

router.get('/login/purchase/premium',userAuthentication.authenticate,purchasePremium.purchasePremium)
router.post('/login/purchase/updateTransaction',userAuthentication.authenticate,purchasePremium.updateTransaction)

module.exports = router;