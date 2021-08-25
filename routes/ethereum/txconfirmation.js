const express = require('express');
const router = express.Router();
const TxconformationController = require('../../controllers/ethereum/txconfirmationController');

router.get("/eth/tx/getconfirmations", TxconformationController.get_eth_tx_confirmation);

module.exports =  router;