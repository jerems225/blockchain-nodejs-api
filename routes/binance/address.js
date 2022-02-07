const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/binance/accountController');

router.get("/bsc/bnb/wallet/getAddress", AccountController.get_Eth_Address);

module.exports =  router;