const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tether/accountController');

router.get("/USDT/createAccount", AccountController.createTokenAccount);

module.exports =  router;