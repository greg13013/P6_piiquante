const express = require('express');

const router = express.Router();

const utilisateursCtrl = require('../controllers/utilisateursCtrl');

const auth = require('../middleware/auth')

router.post('/signup',auth, utilisateursCtrl.signup);
router.post('/login',auth, utilisateursCtrl.login);


module.exports = router;