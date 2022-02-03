const express = require('express');
const router = express.Router();
const AccountController = require('../../controllers/tokens/accountController');

router.post("/:token_symbol/bsc/createwallet", AccountController.createTokenAccount);
router.get("/token/owner/createwallet/:name/:uuid", AccountController.create_owner_TokenAccount);

module.exports =  router;