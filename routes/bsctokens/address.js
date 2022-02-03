const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bsctokens/accountController');

router.get("/:token_symbol/bsc/wallet/getAddress", AccountController.get_token_Address);

module.exports =  router;