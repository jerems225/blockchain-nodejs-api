const express = require('express');
const router = express.Router();
const TxconformationController = require('../../controllers/tether/txconfirmationController');

router.get("/usdt/tx/getconfirmations", TxconformationController.get_usdt_tx_confirmation);

module.exports =  router;