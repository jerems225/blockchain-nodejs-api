const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/ethereum/accountController');

router.get("/ETH/createAccount", AccountController.create_Eth_Account);

module.exports =  router;