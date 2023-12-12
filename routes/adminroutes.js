const express = require('express');

const router = express.Router();
const controller =require('../controller/signup')

router.post('/user',controller.signup);
router.get('/',controller.hello);

module.exports = router;