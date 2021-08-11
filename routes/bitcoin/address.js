const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bitcoin/accountController');

router.get("/btc/wallet/getaddress", AccountController.get_Btc_Address);

module.exports =  router;