const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tokens/accountController');

router.get("/:token_symbol/accountbalance/:uuid", AccountController.get_token_balance);

module.exports =  router;