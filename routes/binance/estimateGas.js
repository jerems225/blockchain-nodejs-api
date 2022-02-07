const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/binance/transactionController.js');

router.post("/bsc/bnb//estimatefees",TransactionController.estimategas);

module.exports =  router;