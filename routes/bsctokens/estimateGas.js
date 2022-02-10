const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/binance/transactionController');

router.post("/:prefix/:token_symbol/estimatefees",TransactionController.estimategas);

module.exports =  router;