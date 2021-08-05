const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/simbcoin/accountController');

router.get("/SMB/accountBalance/:address", AccountController.get_simbcoin_balance);

module.exports =  router;