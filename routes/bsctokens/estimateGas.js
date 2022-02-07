const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/binance/transactionController');

router.post("/:token_symbol/bsctoken/estimatefees",TransactionController.estimategas);

module.exports =  router;