const express = require('express');
const router = express.Router();
const userCtr = require('../controllers/user')

const maximumAttempts = require('../middleware/nbConnects')

router.post('/signup', userCtr.signup)
router.post('/login',maximumAttempts,userCtr.login)

module.exports = router;