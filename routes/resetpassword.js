const express = require('express');

const resetpasswordController = require('../controller/resetpassword');


const router = express.Router();

router.post('/updatepassword/:resetpasswordid', resetpasswordController.postUpdatePassword)

router.post('/resetpassword/:id', resetpasswordController.resetpassword)

router.post('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;