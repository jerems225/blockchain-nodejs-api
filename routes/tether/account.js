const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tether/accountController');

router.post("/usdt/createwallet", AccountController.createTokenAccount);

module.exports =  router;