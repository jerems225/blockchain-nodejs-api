const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/bsctokens/transactionController');

router.post("/:token_symbol/bsc/sendtransaction/:txtype", TransactionController.sendTransaction);

module.exports =  router;