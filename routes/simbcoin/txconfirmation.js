const express = require('express');
const router = express.Router();
const TxconformationController = require('../../controllers/simbcoin/txconfirmationController');

router.get("/smb/tx/getconfirmations", TxconformationController.get_smb_tx_confirmation);

module.exports =  router;