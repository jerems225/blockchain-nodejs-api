const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tokens/accountController');

router.post("/:token_symbol/createwallet", AccountController.createTokenAccount);

module.exports =  router;