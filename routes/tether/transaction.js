const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/tether/transactionController');

router.post("/usdt/sendtransaction", TransactionController.sendTransaction);

module.exports =  router;