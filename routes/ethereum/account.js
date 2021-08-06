const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/ethereum/accountController');

router.post("/eth/createwallet", AccountController.create_Eth_Account);

module.exports =  router;