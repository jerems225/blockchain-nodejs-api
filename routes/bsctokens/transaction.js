const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/bsctokens/transactionController');

router.post("/:prefix/:token_symbol/sendtransaction/:txtype", TransactionController.sendTransaction);

module.exports =  router;