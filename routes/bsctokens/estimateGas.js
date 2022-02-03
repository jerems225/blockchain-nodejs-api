const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/ethereum/transactionController');

router.post("/:token_symbol/bsc/estimatefees",TransactionController.estimategas);

module.exports =  router;