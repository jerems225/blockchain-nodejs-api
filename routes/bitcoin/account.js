const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bitcoin/accountController');

router.get("/BTC/createAccount", AccountController.create_Btc_Account);

module.exports =  router;