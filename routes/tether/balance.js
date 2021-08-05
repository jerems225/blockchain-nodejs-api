const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tether/accountController');

router.get("/USDT/accountBalance/:address", AccountController.get_usdt_balance);

module.exports =  router;