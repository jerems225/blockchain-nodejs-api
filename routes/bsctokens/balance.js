const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bsctokens/accountController');

router.get("/:token_symbol/bsctoken/accountbalance/:uuid", AccountController.get_token_balance);

module.exports =  router;