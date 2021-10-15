const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/ethereum/transactionController.js');

router.post("/eth/estimatefees",TransactionController.estimategas);

module.exports =  router;