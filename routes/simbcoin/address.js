const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/simbcoin/accountController');

router.get("/smb/wallet/getAddress", AccountController.get_simbcoin_Address);

module.exports =  router;