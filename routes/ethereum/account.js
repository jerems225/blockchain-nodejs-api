const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/ethereum/accountController');

router.post("/eth/createwallet", AccountController.create_Eth_Account);
router.get("/eth/owner/createwallet/:uuid", AccountController.create_owner_Eth_Account);

module.exports =  router;