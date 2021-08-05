const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/ethereum/transactionController');

router.get("/ETH/sendTransaction", TransactionController.sendTransaction);

module.exports =  router;