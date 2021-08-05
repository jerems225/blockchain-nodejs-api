const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/tether/transactionController');

router.get("/USDT/sendTransaction", TransactionController.sendTransaction);

module.exports =  router;