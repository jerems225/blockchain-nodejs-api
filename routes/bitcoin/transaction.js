const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/bitcoin/transactionController');

router.post("/btc/sendtransaction", TransactionController.sendTransaction);

module.exports =  router;