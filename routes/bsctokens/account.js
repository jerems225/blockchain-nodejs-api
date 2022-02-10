const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/bsctokens/accountController');

router.post("/:prefix/:token_symbol/createwallet", AccountController.createTokenAccount);
router.get("/token/owner/createwallet/:name/:uuid", AccountController.create_owner_TokenAccount);

module.exports =  router;