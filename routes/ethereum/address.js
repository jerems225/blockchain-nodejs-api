const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/ethereum/accountController');

router.get("/eth/wallet/getAddress", AccountController.get_Eth_Address);

module.exports =  router;