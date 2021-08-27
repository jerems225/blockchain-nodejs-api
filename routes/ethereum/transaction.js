const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/ethereum/transactionController');

router.post("/eth/sendtransaction/:txtype", TransactionController.sendTransaction);

module.exports =  router;