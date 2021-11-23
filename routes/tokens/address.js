const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tokens/accountController');

router.get("/:token_symbol/wallet/getAddress", AccountController.get_token_Address);

module.exports =  router;