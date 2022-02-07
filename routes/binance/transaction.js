const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/binance/transactionController');

router.post("/bsc/bnb/sendtransaction/:txtype", TransactionController.sendTransaction);

module.exports =  router;