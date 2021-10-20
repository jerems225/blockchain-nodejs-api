const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/bitcoin/transactionController');

router.post("/btc/sendtransaction/:txtype", TransactionController.sendTransaction);
router.post("/btc/estimatefees", TransactionController.estimatefees);

module.exports =  router;