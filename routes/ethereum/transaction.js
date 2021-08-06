const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/ethereum/transactionController');

router.post("/eth/sendtransaction", TransactionController.sendTransaction);

module.exports =  router;