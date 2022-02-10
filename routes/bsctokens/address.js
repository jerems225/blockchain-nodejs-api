const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bsctokens/accountController');

router.get("/:prefix/:token_symbol/wallet/getAddress", AccountController.get_token_Address);

module.exports =  router;