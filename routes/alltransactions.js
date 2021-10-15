const express = require('express');
const router = express.Router();
const alltxController = require('../controllers/alltransactionController');

router.get("/tx/getalltransaction", alltxController.get_tx_all);
router.get("/tx/getalltx", alltxController.get_tx_all_all);
router.get("/tx/getalltxnumber", alltxController.get_tx_all_number);

module.exports =  router;