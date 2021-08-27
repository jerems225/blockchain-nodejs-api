const express = require('express');
const router = express.Router();
const alltxController = require('../controllers/alltransactionController');

router.get("/tx/getalltransaction", alltxController.get_tx_all);

module.exports =  router;