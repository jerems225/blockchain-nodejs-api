const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/simbcoin/transactionController');

router.get("/SMB/sendTransaction", TransactionController.sendTransaction);

module.exports =  router;