const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/simbcoin/accountController');

router.get("/smb/accountbalance/:uuid", AccountController.get_simbcoin_balance);

module.exports =  router;