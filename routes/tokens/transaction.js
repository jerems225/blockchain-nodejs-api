const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/tokens/transactionController');

router.post("/:token_symbol/sendtransaction/:txtype", TransactionController.sendTransaction);

module.exports =  router;