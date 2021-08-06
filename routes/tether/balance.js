const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tether/accountController');

router.get("/usdt/accountbalance/:uuid", AccountController.get_usdt_balance);

module.exports =  router;