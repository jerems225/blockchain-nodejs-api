const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/ethereum/accountController');

router.get("/ETH/accountBalance/:address", AccountController.get_Eth_Balance);

module.exports =  router;