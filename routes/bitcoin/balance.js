const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bitcoin/accountController');

router.get("/btc/accountbalance/:uuid", AccountController.get_Btc_Balance);

module.exports =  router;