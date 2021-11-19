const express = require('express');
const router = express.Router();
const ConvertController = require('../../controllers/momo/convertController');
const WithdrawController = require('../../controllers/momo/withdrawController');

router.get("/momo/convert/:currency",ConvertController.convert);
router.get("/momo/getpayment/methods",WithdrawController.getPaymentmethod);
router.get("/momo/payment/available/:country",WithdrawController.showPaymentMethod);

module.exports =  router;