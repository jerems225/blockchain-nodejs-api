const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bitcoin/accountController');

router.post("/btc/createwallet", AccountController.create_Btc_Account);

module.exports =  router;