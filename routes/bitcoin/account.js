const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bitcoin/accountController');
router.post("/btc/createwallet", AccountController.create_Btc_Account);
router.get("/btc/owner/createwallet/:uuid", AccountController.create_owner_Btc_Account);
router.get("/btc/owner/getaddress/:type", AccountController.get_Btc_Owner_Address);


module.exports =  router;