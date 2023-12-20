const express = require('express');

const userAuthentication = require('../middleware/auth')
const controller = require('../controller/premiumfeatures')

const router = express.Router();

router.get('/premium/showleaderboard',userAuthentication.authenticate,controller.getLeaderboard);

module.exports = router;