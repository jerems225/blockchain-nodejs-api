const express = require('express');
const router = express.Router();
const TransactionController = require('../../controllers/simbcoin/transactionController');

router.post("/smb/sendtransaction", TransactionController.sendTransaction);

module.exports =  router;