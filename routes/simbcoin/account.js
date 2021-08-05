const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/simbcoin/accountController');

router.get("/SMB/createAccount", AccountController.createTokenAccount);

module.exports =  router;