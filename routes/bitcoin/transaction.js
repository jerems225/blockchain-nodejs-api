const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/bitcoin/transactionController');

router.get("/BTC/sendTransaction", TransactionController.sendTransaction);

module.exports =  router;