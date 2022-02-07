const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/binance/accountController');

router.post("/bsc/bnb/createwallet", AccountController.create_Eth_Account);
router.get("/bsc/bnb/owner/createwallet/:uuid", AccountController.create_owner_Eth_Account);

module.exports =  router;