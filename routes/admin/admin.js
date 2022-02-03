const express = require('express');
const { ownerwallet } = require('../../controllers/admin/accountController');
const { Balance } = require('../../controllers/admin/balanceController');
const router = express.Router();

router.get("/admin/ownerwallet/:crypto_name",ownerwallet);
router.get("/admin/owner/balance",Balance);

module.exports =  router;