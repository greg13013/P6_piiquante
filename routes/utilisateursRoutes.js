const express = require('express');

const router = express.Router();

const utilisateursCtrl = require('../controllers/utilisateursCtrl');

// const auth = require('../middleware/auth')

router.post('/signup', utilisateursCtrl.signup);
router.post('/login', utilisateursCtrl.login);


module.exports = router;