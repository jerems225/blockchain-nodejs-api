const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/binance/accountController');

router.get("/bsc/bnb/accountbalance/:uuid", AccountController.get_Eth_Balance);

module.exports =  router;