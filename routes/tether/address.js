const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tether/accountController');

router.get("/usdt/wallet/getAddress", AccountController.get_usdt_Address);

module.exports =  router;